import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from "@nestjs/common";
import { BannerService } from "./banner.service";
import { BannerEntity } from "../../entities/banner.entity";
import {
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CreateBannerDto } from "../../core/dto/banner/create-banner.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { Uploader } from "../../utils/uploader";
import { UpdateBannerDto } from "../../core/dto/banner/update-banner.dto";
import { DeleteUploadedFileOnErrorFilter } from "../../core/filters/delete-uploaded-file-on-error.filter";
import { DataTablePayloadDto } from "../../core/dto/data-table-payload.dto";
import { PaginationResponseDto } from "../../core/dto/pagination-response.dto";
import { ApiPaginatedResponse } from "../../core/decorators/api-paginated-response";
import { UpdateSingleAttributeOfEntityDto } from "../../core/dto/update-single-attribute-of-entity.dto";
import { BannerPosition } from "../../models/enums/banner-position";

@Controller("banner")
@ApiTags("Banner")
export class BannerController {
  constructor(private bannerService: BannerService) {}

  @Get()
  @ApiOperation({
    summary: "Get all banners",
    description: "This GET request should return all banners",
  })
  @ApiPaginatedResponse({
    model: BannerEntity,
    total: 3,
  })
  public getBanners(
    @Query() query: DataTablePayloadDto,
  ): Promise<PaginationResponseDto<BannerEntity>> {
    return this.bannerService.getBanners(query);
  }

  @Get("/actives")
  @ApiOperation({
    summary: "Get all active banners",
    description: "This GET request should return all active banners",
  })
  @ApiResponse({
    status: 200,
    description: "The records successfully found",
    type: [BannerEntity],
  })
  public getAllActivesBanners(): Promise<BannerEntity[]> {
    return this.bannerService.getActiveBanners();
  }

  @Get("/:id")
  @ApiOperation({
    summary: "Get banner",
    description: "This GET request should return specific banner by ID",
  })
  @ApiResponse({
    status: 200,
    description: "The record successfully found",
    type: BannerEntity,
  })
  public getBanner(@Param("id") id: number): Promise<BannerEntity> {
    return this.bannerService.getBanner(id);
  }

  @Post()
  @ApiOperation({
    summary: "Create new banner",
    description: "This POST request should create new banner then return",
  })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({
    status: 200,
    description: "The record successfully created",
    type: BannerEntity,
  })
  @UseInterceptors(
    FileInterceptor("image", {
      storage: Uploader.fileStore("./public/banners"),
    }),
  )
  @UseFilters(DeleteUploadedFileOnErrorFilter)
  public createBanner(
    @Body() body: CreateBannerDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" })],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ): Promise<BannerEntity> {
    return this.bannerService.createBanner(body, file);
  }

  @Put("/:id")
  @ApiOperation({
    summary: "Update existing banner",
    description:
      "This PUT request should update existing banner by ID then return",
  })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({
    status: 200,
    description: "The record successfully updated",
    type: BannerEntity,
  })
  @UseInterceptors(
    FileInterceptor("image", {
      storage: Uploader.fileStore("./public/banners"),
    }),
  )
  @UseFilters(DeleteUploadedFileOnErrorFilter)
  public updateBanner(
    @Param("id") id: string,
    @Body() body: UpdateBannerDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" })],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ): Promise<BannerEntity> {
    return this.bannerService.updateBanner(id, body, file);
  }

  @Delete("/:id")
  @ApiOperation({
    summary: "Delete banner",
    description: "This DELETE request should remove banner by ID",
  })
  @ApiResponse({
    status: 200,
    description: "The record successfully deleted",
  })
  public deleteBanner(@Param("id") bannerId: string): Promise<void> {
    return this.bannerService.deleteBanner(bannerId);
  }

  @Put("/:id/update-attribute")
  @ApiOperation({
    summary: "Change activity",
    description: "PUT request should change banner activity state of by ID",
  })
  @ApiResponse({
    status: 200,
    description: "The record successfully updated",
  })
  public setBannerActiveState(
    @Param("id") id: number,
    @Body() body: UpdateSingleAttributeOfEntityDto<BannerEntity, boolean>,
  ): Promise<void> {
    return this.bannerService.updateAttribute(id, body);
  }
}
