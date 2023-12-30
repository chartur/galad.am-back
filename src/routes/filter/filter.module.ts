import { Module } from "@nestjs/common";
import { FilterController } from "./filter.controller";
import { FilterService } from "./filter.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "../../entities/product.entity";

@Module({
  controllers: [FilterController],
  providers: [FilterService],
  imports: [TypeOrmModule.forFeature([ProductEntity])],
})
export class FilterModule {}
