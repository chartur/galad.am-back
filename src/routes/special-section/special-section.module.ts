import { Module } from "@nestjs/common";
import { SpecialSectionController } from "./special-section.controller";
import { SpecialSectionService } from "./special-section.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SpecialSectionEntity } from "../../entities/special-section.entity";
import { GuardsModule } from "../../shared/guards/guards.module";

@Module({
  controllers: [SpecialSectionController],
  providers: [SpecialSectionService],
  imports: [TypeOrmModule.forFeature([SpecialSectionEntity]), GuardsModule],
})
export class SpecialSectionModule {}
