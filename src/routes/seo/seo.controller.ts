import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { SeoEntity } from "../../entities/seo.entity";
import { SeoPages } from "../../models/enums/seo-pages";
import { SeoService } from "./seo.service";
import { AdminGuard } from "../../shared/guards/admin.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { Uploader } from "../../utils/uploader";
import { DeleteUploadedFileOnErrorFilter } from "../../core/filters/delete-uploaded-file-on-error.filter";
import { SaveSeoDto } from "../../core/dto/seo/save-seo.dto";

@Controller("seo")
@ApiTags("Seo")
export class SeoController {
  constructor(private seoService: SeoService) {}

  @Get(":page")
  @ApiOperation({
    summary: "Get a Page seo data",
    description: "This GET request should return SEO data of specific page",
  })
  @ApiResponse({
    status: 200,
    description: "The record successfully found",
  })
  public getPage(@Param("page") page: SeoPages): Promise<SeoEntity> {
    return this.seoService.getPage(page);
  }

  @Post(":page")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create/Update Page seo data",
    description:
      "This POST request should create or update specific page seo data",
  })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({
    status: 200,
    description: "The record successfully saved",
    type: SeoEntity,
  })
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileInterceptor("image", {
      storage: Uploader.fileStore(() => "./public/seo/:page/"),
    }),
  )
  @UseFilters(DeleteUploadedFileOnErrorFilter)
  public savePageSeoData(
    @Param("page") page: SeoPages,
    @Body() body: SaveSeoDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" })],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ): Promise<SeoEntity> {
    return this.seoService.savePageSeoData(page, body, file);
  }
}
