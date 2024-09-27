import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "../../entities/product.entity";
import { OrderEntity } from "../../entities/order.entity";
import { OrderProductEntity } from "../../entities/order-product.entity";
import { GuardsModule } from "../../shared/guards/guards.module";
import { ServicesModule } from "../../shared/services/services.module";
import {PromoEntity} from "../../entities/promo.entity";

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [
    TypeOrmModule.forFeature([OrderEntity, ProductEntity, OrderProductEntity, PromoEntity]),
    GuardsModule,
    ServicesModule,
  ],
})
export class OrderModule {}
