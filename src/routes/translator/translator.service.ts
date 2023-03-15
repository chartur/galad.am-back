import { Injectable, Logger } from "@nestjs/common";
import { TranslationResponseDto } from "../../core/dto/translator/translation-response.dto";
import { TranslationRequestDto } from "../../core/dto/translator/translation-request.dto";
import { GTranslatorService } from "../../shared/modules/g-translator/g-translator.service";

@Injectable()
export class TranslatorService {
  private readonly logger = new Logger(TranslatorService.name);

  constructor(private gTranslatorService: GTranslatorService) {}

  public translate(
    body: TranslationRequestDto,
  ): Promise<TranslationResponseDto> {
    this.logger.log("[Translator] translate text", body);

    return this.gTranslatorService
      .translate(body.payload, body.source_language, body.target_language)
      .then((text) => ({
        ...body,
        payload: text,
      }));
  }
}
