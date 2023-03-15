import {
  Body,
  Controller,
  Get,
  Param,
  Post, Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
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

@ApiTags("Product")
@ApiExtraModels(PaginationResponseDto)
@Controller("product")
export class ProductController {
  constructor(private productService: ProductService) {}

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
  public getBanners(
    @Param("status") status: ProductStatus,
    @Query() query: DataTablePayloadDto,
  ): Promise<PaginationResponseDto<ProductEntity>> {
    return this.productService.getProductsByStatus(status, query);
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
  public getProductById(@Param("id") id: number): Promise<ProductEntity> {
    return this.productService.getProductById(id);
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
    @Param("id") id: number | undefined,
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
}
