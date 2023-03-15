import { Module } from "@nestjs/common";
import { GTranslatorService } from "./g-translator.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  providers: [GTranslatorService],
  exports: [GTranslatorService],
  imports: [HttpModule],
})
export class GTranslatorModule {}
