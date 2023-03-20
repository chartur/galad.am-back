import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { GuardsModule } from "../../shared/guards/guards.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "../../entities/product.entity";
import { ProductAssetEntity } from "../../entities/product-asset.entity";
import { ProductAssetService } from "./product-asset.service";
import { CategoryEntity } from "../../entities/category.entity";

@Module({
  providers: [ProductService, ProductAssetService],
  controllers: [ProductController],
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductAssetEntity,
      CategoryEntity,
    ]),
    GuardsModule,
  ],
})
export class ProductModule {}
