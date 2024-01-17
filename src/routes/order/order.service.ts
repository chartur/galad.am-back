import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "../../entities/order.entity";
import { DataSource, In, Repository } from "typeorm";
import { OrderProductEntity } from "../../entities/order-product.entity";
import { CreateOrderDto } from "../../core/dto/order/create-order.dto";
import { ProductEntity } from "../../entities/product.entity";
import { ResponseUser } from "../../core/interfaces/response-user";
import {UserEntity} from "../../entities/user.entity";

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  constructor(
    @InjectRepository(OrderEntity)
    private orderEntityRepository: Repository<OrderEntity>,
    @InjectRepository(OrderProductEntity)
    private orderProductEntityRepository: Repository<OrderProductEntity>,
    @InjectRepository(ProductEntity)
    private productEntityRepository: Repository<ProductEntity>,
    private dataSource: DataSource,
  ) {}

  async create(
    body: CreateOrderDto,
    user?: ResponseUser,
  ): Promise<OrderEntity> {
    this.logger.log("[Order] create new order", {
      body,
      user,
    });
    const productsMap = body.products.reduce((accumulator, current) => {
      if (current.quantity > 0) {
        accumulator[current.productId] = current.quantity;
      }
      return accumulator;
    }, {});
    const productIds = Object.keys(productsMap);
    let originalPrice = 0;
    let totalPrice = 0;
    let totalQuantity = 0;
    const products = await this.productEntityRepository.find({
      where: {
        id: In(productIds),
      },
    });

    const order = this.orderEntityRepository.create();
    if (user) {
      order.user = user as UserEntity;
    }
    order.email = body.info.email;
    order.phone = body.info.phone;
    const orderProducts = [];
    products.forEach((product) => {
      const quantity = productsMap[product.id];
      if (product.available_count < quantity) {
        throw new HttpException(
          "Unavailable product quantity",
          HttpStatus.BAD_REQUEST,
        );
      }
      product.available_count -= quantity;
      totalQuantity += quantity;
      originalPrice += product.price * quantity;
      totalPrice += (product.new_price || product.price) * quantity;
      const orderProduct = this.orderProductEntityRepository.create();
      orderProduct.product = product;
      orderProduct.quantity = quantity;
      orderProduct.price = (product.new_price || product.price).toFixed(2);
      orderProduct.totalPrice = (
        (product.new_price || product.price) * quantity
      ).toFixed(2);
      orderProducts.push(orderProduct);
    });
    const discount = originalPrice - totalPrice;
    order.totalQuantity = totalQuantity;
    order.totalPrice = totalPrice.toFixed(2);
    order.originalPrice = originalPrice.toFixed(2);
    order.discounts = discount.toFixed(2);
    order.orderProducts = orderProducts;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(OrderProductEntity, orderProducts);
      await queryRunner.manager.save(OrderEntity, order);
      await queryRunner.manager.save(ProductEntity, products);
      await queryRunner.commitTransaction();
      return order;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
