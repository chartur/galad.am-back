import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "../../entities/order.entity";
import { Brackets, DataSource, In, Repository } from "typeorm";
import { OrderProductEntity } from "../../entities/order-product.entity";
import { CreateOrderDto } from "../../core/dto/order/create-order.dto";
import { ProductEntity } from "../../entities/product.entity";
import { ResponseUser } from "../../core/interfaces/response-user";
import { UserEntity } from "../../entities/user.entity";
import { PaginationResponseDto } from "../../core/dto/pagination-response.dto";
import { OrderFilterDto } from "../../core/dto/order/order-filter.dto";
import { PusherService } from "../../shared/services/pusher.service";
import process from "process";

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
    private pusherService: PusherService,
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
      orderProduct.price = product.new_price || product.price;
      orderProduct.totalPrice = (product.new_price || product.price) * quantity;
      orderProducts.push(orderProduct);
    });
    const discount = originalPrice - totalPrice;
    order.totalQuantity = totalQuantity;
    order.totalPrice = totalPrice;
    order.originalPrice = originalPrice;
    order.discounts = discount;
    order.orderProducts = orderProducts;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(OrderProductEntity, orderProducts);
      await queryRunner.manager.save(OrderEntity, order);
      await queryRunner.manager.save(ProductEntity, products);
      await queryRunner.commitTransaction();
      this.pusherService.emit({
        title: "New Order",
        body: "You have new order GD000024",
        icon: "https://galad.am/assets/logo.png",
        data: {
          link: `${process.env.adminUrl}/portal/order/${order.id}`,
        },
      });
      return order;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  public async getAll(
    body: OrderFilterDto,
  ): Promise<PaginationResponseDto<OrderEntity>> {
    this.logger.log("[Order] get all by filter", {
      body,
    });

    let query = this.orderEntityRepository
      .createQueryBuilder("orders")
      .leftJoinAndSelect("orders.orderProducts", "orderProducts")
      .leftJoinAndSelect("orderProducts.product", "products")
      .leftJoinAndSelect("orders.user", "user")
      .skip((body.page - 1) * body.limit)
      .select(["orders.id"]);

    if (body.priceLow && body.priceHigh) {
      query = query.andWhere(
        "orders.totalPrice BETWEEN :priceLow and :priceHigh",
        {
          priceLow: body.priceLow,
          priceHigh: body.priceHigh,
        },
      );
    } else if (body.priceLow) {
      query = query.andWhere("orders.totalPrice >= :priceLow", {
        priceLow: body.priceLow,
      });
    } else if (body.priceHigh) {
      query = query.andWhere("orders.totalPrice <= :priceHigh", {
        priceHigh: body.priceHigh,
      });
    }

    if (body.statuses?.length > 0) {
      query = query.andWhere("orders.status IN (:...statuses)", {
        statuses: body.statuses,
      });
    }

    if (body.products?.length > 0) {
      query = query.andWhere("products.id IN (:...productIds)", {
        productIds: body.products,
      });
    }
    const filter = body.filter.trim();
    if (filter) {
      query = query.andWhere(
        new Brackets((q) => {
          q.orWhere("orders.email ILIKE :q", {
            q: `%${filter}%`,
          })
            .orWhere("orders.phone ILIKE :q", {
              q: `%${filter}%`,
            })
            .orWhere("user.fullName ILIKE :q", {
              q: `%${filter}%`,
            });
        }),
      );
    }

    if (body.limit && body.limit > 0) {
      query = query.take(body.limit);
    }

    if (body.sortBy) {
      query = query.orderBy(body.sortBy, body.order);
    }

    const [ids, count] = await query.getManyAndCount();

    const result = await this.orderEntityRepository.find({
      where: {
        id: In(ids.map((entity) => entity.id)),
      },
      relations: ["orderProducts.product", "user"],
    });

    return {
      total: count,
      results: result,
    };
  }

  public getOne(orderId: string): Promise<OrderEntity> {
    this.logger.log("[Order] get one by ID", {
      orderId,
    });

    return this.orderEntityRepository.findOneOrFail({
      where: {
        id: orderId,
      },
      relations: {
        orderProducts: {
          product: {
            category: true,
          },
        },
        user: true,
      },
    });
  }
}
