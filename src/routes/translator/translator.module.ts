import { Module } from "@nestjs/common";
import { TranslatorController } from "./translator.controller";
import { TranslatorService } from "./translator.service";
import { GuardsModule } from "../../shared/guards/guards.module";
import { GTranslatorModule } from "../../shared/modules/g-translator/g-translator.module";

@Module({
  controllers: [TranslatorController],
  imports: [GuardsModule, GTranslatorModule],
  providers: [TranslatorService],
})
export class TranslatorModule {}
