import { Module } from "@nestjs/common";
import { PromosController } from "./promos.controller";
import { PromosService } from "./promos.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PromoEntity } from "../../entities/promo.entity";
import { GuardsModule } from "../../shared/guards/guards.module";

@Module({
  controllers: [PromosController],
  providers: [PromosService],
  imports: [TypeOrmModule.forFeature([PromoEntity]), GuardsModule],
})
export class PromosModule {}
