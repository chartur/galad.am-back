import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { TranslationResponseDto } from "../../core/dto/translator/translation-response.dto";
import { TranslatorService } from "./translator.service";
import { TranslationRequestDto } from "../../core/dto/translator/translation-request.dto";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AdminGuard } from "../../shared/guards/admin.guard";

@ApiTags("Translator")
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller("translator")
export class TranslatorController {
  constructor(private translatorService: TranslatorService) {}

  @Post()
  @ApiOperation({
    summary: "Translate text",
    description:
      "POST request should translate text from source language to target language",
  })
  @ApiResponse({
    status: 200,
    description: "The text successfully translated",
    type: TranslationResponseDto,
  })
  public translate(
    @Body() body: TranslationRequestDto,
  ): Promise<TranslationResponseDto> {
    return this.translatorService.translate(body);
  }
}
