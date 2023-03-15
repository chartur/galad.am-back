import { ApiProperty } from "@nestjs/swagger";
import { TranslationLanguage } from "../../../models/enums/translation-language";

export class TranslationResponseDto {
  @ApiProperty({
    required: true,
    description: "Translated text",
    example: "Test text",
  })
  payload: string;

  @ApiProperty({
    required: true,
    enum: TranslationLanguage,
    description: "Source language of translation",
    example: TranslationLanguage.AM,
  })
  source_language: TranslationLanguage;

  @ApiProperty({
    required: true,
    enum: TranslationLanguage,
    description: "Target language translation",
    example: TranslationLanguage.EN,
  })
  target_language: TranslationLanguage;
}
