import { Module } from "@nestjs/common";
import { BannerController } from "./banner.controller";
import { BannerService } from "./banner.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BannerEntity } from "../../entities/banner.entity";
import { GuardsModule } from "../../shared/guards/guards.module";

@Module({
  controllers: [BannerController],
  providers: [BannerService],
  imports: [TypeOrmModule.forFeature([BannerEntity]), GuardsModule],
})
export class BannerModule {}
