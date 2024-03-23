import { Module } from "@nestjs/common";
import { SeoController } from "./seo.controller";
import { SeoService } from "./seo.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SeoEntity } from "../../entities/seo.entity";
import { GuardsModule } from "../../shared/guards/guards.module";
import { ServicesModule } from "../../shared/services/services.module";

@Module({
  controllers: [SeoController],
  providers: [SeoService],
  imports: [
    TypeOrmModule.forFeature([SeoEntity]),
    GuardsModule,
    ServicesModule,
  ],
})
export class SeoModule {}
