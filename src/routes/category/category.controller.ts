import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
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
import { PaginationResponseDto } from "../../core/dto/pagination-response.dto";
import {
  CategoryEntity,
  CategoryWithProductsCount,
} from "../../entities/category.entity";
import { ApiPaginatedResponse } from "../../core/decorators/api-paginated-response";
import { DataTablePayloadDto } from "../../core/dto/data-table-payload.dto";
import { CategoryStatus } from "../../models/enums/category-status";
import { CategoryService } from "./category.service";
import { AdminGuard } from "../../shared/guards/admin.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { Uploader } from "../../utils/uploader";
import { DeleteUploadedFileOnErrorFilter } from "../../core/filters/delete-uploaded-file-on-error.filter";
import { CreateCategoryDto } from "../../core/dto/category/create-category.dto";
import { UpdateCategoryDto } from "../../core/dto/category/update-category.dto";

@ApiTags("Category")
@Controller("category")
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get("/by-status/:status")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get all categories",
    description: "This GET request should return all categories by status",
  })
  @ApiPaginatedResponse({
    model: CategoryEntity,
    total: 3,
  })
  @UseGuards(AdminGuard)
  public getCategories(
    @Param("status") status: CategoryStatus,
    @Query() query: DataTablePayloadDto,
  ): Promise<PaginationResponseDto<CategoryEntity>> {
    return this.categoryService.getCategoriesByStatus(status, query);
  }

  @Get("/actives")
  @ApiOperation({
    summary: "Get all active categories",
    description: "This GET request should return all active categories",
  })
  @ApiResponse({
    status: 200,
    description: "The records successfully found",
    type: [CategoryEntity],
  })
  public getAllActiveCategories(): Promise<CategoryWithProductsCount[]> {
    return this.categoryService.getAllActiveCategories();
  }

  @Get(":id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get one category",
    description: "GET request should return specific category by ID",
  })
  @ApiResponse({
    status: 200,
    description: "Record successfully found",
    type: CategoryEntity,
  })
  public getCategoryById(
    @Param("id") categoryId: number,
  ): Promise<CategoryEntity> {
    return this.categoryService.getCategoryById(categoryId);
  }

  @Put(":id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update category",
    description: "PUT request should update specific category by ID",
  })
  @ApiResponse({
    status: 200,
    description: "Record successfully updated",
    type: CategoryEntity,
  })
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileInterceptor("link", {
      storage: Uploader.fileStore("./public/categories"),
    }),
  )
  @UseFilters(DeleteUploadedFileOnErrorFilter)
  public updateCategoryById(
    @Param("id") categoryId: number,
    @Body() body: UpdateCategoryDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" })],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ): Promise<CategoryEntity> {
    return this.categoryService.updateCategoryById(categoryId, body, file);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create new category",
    description: "This POST request should create new category",
  })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({
    status: 200,
    description: "The record successfully created",
    type: CategoryEntity,
  })
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileInterceptor("link", {
      storage: Uploader.fileStore("./public/categories"),
    }),
  )
  @UseFilters(DeleteUploadedFileOnErrorFilter)
  public createCategory(
    @Body() body: CreateCategoryDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" })],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ): Promise<CategoryEntity> {
    return this.categoryService.createCategory(body, file);
  }

  @Put("/activate/:id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Activate category",
    description: "PUT request should activate category",
  })
  @ApiResponse({
    status: 200,
    type: CategoryEntity,
    description: "The record successfully updated/created",
  })
  @UseGuards(AdminGuard)
  public activateCategory(@Param("id") id: number): Promise<CategoryEntity> {
    return this.categoryService.activateCategory(id);
  }

  @Put("/disable/:id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Disable category",
    description: "PUT request should disable category",
  })
  @ApiResponse({
    status: 200,
    type: CategoryEntity,
    description: "The record successfully updated/created",
  })
  @UseGuards(AdminGuard)
  public disableCategory(@Param("id") id: number): Promise<CategoryEntity> {
    return this.categoryService.disableCategory(id);
  }
}
