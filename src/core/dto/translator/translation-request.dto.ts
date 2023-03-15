import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";
import { TranslationLanguage } from "../../../models/enums/translation-language";

export class TranslationRequestDto {
  @ApiProperty({
    required: true,
    description: "Text that should be translated",
    example: "Փորձնական տեքստ",
  })
  @IsString()
  payload: string;

  @IsEnum(TranslationLanguage)
  @ApiProperty({
    required: true,
    enum: TranslationLanguage,
    description: "Source language of translation",
    example: TranslationLanguage.AM,
  })
  source_language: TranslationLanguage;

  @IsEnum(TranslationLanguage)
  @ApiProperty({
    required: true,
    enum: TranslationLanguage,
    description: "Target language translation",
    example: TranslationLanguage.EN,
  })
  target_language: TranslationLanguage;
}
