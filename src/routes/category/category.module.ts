import { Module } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryEntity } from "../../entities/category.entity";
import { GuardsModule } from "../../shared/guards/guards.module";
import { ProductEntity } from "../../entities/product.entity";

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [
    TypeOrmModule.forFeature([CategoryEntity, ProductEntity]),
    GuardsModule,
  ],
})
export class CategoryModule {}
