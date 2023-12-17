import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ProductEntity } from "../../entities/product.entity";
import { AdminGuard } from "../../shared/guards/admin.guard";
import { ProductService } from "./product.service";
import { SaveProductContentDto } from "../../core/dto/product/save-product-content.dto";
import { ApiPaginatedResponse } from "../../core/decorators/api-paginated-response";
import { DataTablePayloadDto } from "../../core/dto/data-table-payload.dto";
import { PaginationResponseDto } from "../../core/dto/pagination-response.dto";
import { ProductStatus } from "../../models/enums/product-status";
import { SaveProductValuesDto } from "../../core/dto/product/save-product-values.dto";
import { SaveProductSettingsDto } from "../../core/dto/product/save-product-settings.dto";
import { ProductAssetService } from "./product-asset.service";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { DeleteUploadedFileOnErrorFilter } from "../../core/filters/delete-uploaded-file-on-error.filter";
import { SaveProductAssetsDto } from "../../core/dto/product/save-product-assets.dto";
import { Uploader } from "../../utils/uploader";
import { CategoryEntity } from "../../entities/category.entity";

@ApiTags("Product")
@ApiExtraModels(PaginationResponseDto)
@Controller("product")
export class ProductController {
  constructor(
    private productService: ProductService,
    private productAssetService: ProductAssetService,
  ) {}

  @Get("/by-status/:status")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get products by status",
    description:
      "This GET request should return products by status with pagination",
  })
  @ApiPaginatedResponse({
    model: ProductEntity,
    total: 3,
  })
  @UseGuards(AdminGuard)
  public getProductsByStatus(
    @Param("status") status: ProductStatus,
    @Query() query: DataTablePayloadDto,
  ): Promise<PaginationResponseDto<ProductEntity>> {
    return this.productService.getProductsByStatus(status, query);
  }

  @Get("/new-arrivals")
  @ApiOperation({
    summary: "Get new arrivals",
    description:
      "GET request should return products that marked as new arrival",
  })
  @ApiResponse({
    status: 200,
    type: [CategoryEntity],
    description: "The records successfully found",
  })
  public getNewArrivals(): Promise<CategoryEntity[]> {
    return this.productService.getNewArrivals();
  }

  @Get("/:id")
  @ApiOperation({
    summary: "Get product",
    description: "GET request should select specific product by ID",
  })
  @ApiResponse({
    status: 200,
    type: ProductEntity,
    description: "The record successfully found",
  })
  public async getProductById(@Param("id") id: number): Promise<ProductEntity> {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(1);
      }, 2000);
    });
    return this.productService.getProductById(id);
  }

  @Get("related/:id")
  @ApiOperation({
    summary: "Get products related to current product",
    description:
      "GET request should select products related to the specific product by ID",
  })
  @ApiResponse({
    status: 200,
    type: [ProductEntity],
    description: "The records successfully found",
  })
  public getRelatedProducts(@Param("id") id: number): Promise<ProductEntity[]> {
    return this.productService.getRelatedProducts(id);
  }

  @Post("/:id?/content")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Save product content",
    description: "POST request should save new or existing product content",
  })
  @ApiResponse({
    status: 200,
    type: ProductEntity,
    description: "The record successfully updated/created",
  })
  @UseGuards(AdminGuard)
  public saveProductContentData(
    @Param("id") id: string | null,
    @Body() body: SaveProductContentDto,
  ): Promise<ProductEntity> {
    return this.productService.saveProductContentData(id, body);
  }

  @Put("/:id/values")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Save product content",
    description: "POST request should save new or existing product content",
  })
  @ApiResponse({
    status: 200,
    type: ProductEntity,
    description: "The record successfully updated/created",
  })
  @UseGuards(AdminGuard)
  public saveProductValuesData(
    @Param("id") id: number,
    @Body() body: SaveProductValuesDto,
  ): Promise<ProductEntity> {
    return this.productService.saveProductValuesData(id, body);
  }

  @Put("/:id/settings")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Save product settings",
    description: "POST request should save new or existing product settings",
  })
  @ApiResponse({
    status: 200,
    type: ProductEntity,
    description: "The record successfully updated/created",
  })
  @UseGuards(AdminGuard)
  public saveProductSettingsData(
    @Param("id") id: number,
    @Body() body: SaveProductSettingsDto,
  ): Promise<ProductEntity> {
    return this.productService.saveProductSettingsData(id, body);
  }

  @Post("/:id/assets")
  @ApiConsumes("multipart/form-data")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Save product assets",
    description: "POST request should save new or existing product assets",
  })
  @ApiResponse({
    status: 200,
    type: ProductEntity,
    description: "The record successfully updated/created",
  })
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "newPhotos[]", maxCount: 4 }], {
      storage: Uploader.fileStore(() => "./public/product-assets/:id/"),
    }),
  )
  @UseFilters(DeleteUploadedFileOnErrorFilter)
  public saveProductAssetsData(
    @Param("id") id: number,
    @Body() body: SaveProductAssetsDto,
    @UploadedFiles() files: { "newPhotos[]": Array<Express.Multer.File> },
  ): Promise<ProductEntity> {
    return this.productAssetService.saveProductAssetsData(
      id,
      body,
      files["newPhotos[]"],
    );
  }

  @Patch("/:id/assets/main/:assetId")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Set main image",
    description:
      "PATCH request should make image as main image of current product",
  })
  @ApiResponse({
    status: 200,
    description: "The record successfully updated",
  })
  @UseGuards(AdminGuard)
  public setMainImage(
    @Param("id") id: number,
    @Param("assetId") assetId: number,
  ): Promise<void> {
    return this.productAssetService.setMainImage(id, assetId);
  }

  @Put("/activate/:id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Activate product",
    description: "PUT request should activate product",
  })
  @ApiResponse({
    status: 200,
    type: ProductEntity,
    description: "The record successfully updated/created",
  })
  @UseGuards(AdminGuard)
  public activateProduct(@Param("id") id: number): Promise<ProductEntity> {
    return this.productService.activateProduct(id);
  }

  @Put("/disable/:id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Disable product",
    description: "PUT request should disable product",
  })
  @ApiResponse({
    status: 200,
    type: ProductEntity,
    description: "The record successfully updated/created",
  })
  @UseGuards(AdminGuard)
  public disableProduct(@Param("id") id: number): Promise<ProductEntity> {
    return this.productService.disableProduct(id);
  }

  @Delete("/delete/:id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete product",
    description: "DELETE request should make product status as Deleted",
  })
  @ApiResponse({
    status: 200,
    type: ProductEntity,
    description: "The record successfully updated/created",
  })
  @UseGuards(AdminGuard)
  public deleteProduct(@Param("id") id: number): Promise<ProductEntity> {
    return this.productService.deleteProduct(id);
  }

  @Put("/move-to-draft/:id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Move product to draft list",
    description: "PUT request should make product status as Draft",
  })
  @ApiResponse({
    status: 200,
    type: ProductEntity,
    description: "The record successfully updated/created",
  })
  @UseGuards(AdminGuard)
  public moveToDraft(@Param("id") id: number): Promise<ProductEntity> {
    return this.productService.moveToDraft(id);
  }
}
