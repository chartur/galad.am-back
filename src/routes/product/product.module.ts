import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { GuardsModule } from "../../shared/guards/guards.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "../../entities/product.entity";

@Module({
  providers: [ProductService],
  controllers: [ProductController],
  imports: [TypeOrmModule.forFeature([ProductEntity]), GuardsModule],
})
export class ProductModule {}
