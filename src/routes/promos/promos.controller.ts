import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { PromosService } from "./promos.service";
import { ApiPaginatedResponse } from "../../core/decorators/api-paginated-response";
import { PromoEntity } from "../../entities/promo.entity";
import { AdminGuard } from "../../shared/guards/admin.guard";
import { DataTablePayloadDto } from "../../core/dto/data-table-payload.dto";
import { PaginationResponseDto } from "../../core/dto/pagination-response.dto";
import { PromoDto } from "../../core/dto/promo/promo.dto";

@Controller("promos")
@ApiTags("Promos")
export class PromosController {
  constructor(private readonly promosService: PromosService) {}

  @Get("/")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get promos",
    description: "This GET request should return promos with pagination",
  })
  @ApiPaginatedResponse({
    model: PromoEntity,
    total: 3,
  })
  @UseGuards(AdminGuard)
  public getAll(
    @Query() query: DataTablePayloadDto,
  ): Promise<PaginationResponseDto<PromoEntity>> {
    return this.promosService.getAll(query);
  }

  @Get("/get-by-code")
  @ApiOperation({
    summary: "Get promo",
    description: "This GET request should get promo by Code name",
  })
  @ApiResponse({
    status: 200,
    description: "The record successfully loaded",
    type: PromoEntity,
  })
  public getOneByCode(@Query("code") code: string): Promise<PromoEntity> {
    return this.promosService.getByCode(code);
  }

  @Get("/:id")
  @ApiOperation({
    summary: "Get promo",
    description: "This GET request should get promo by id",
  })
  @ApiResponse({
    status: 200,
    description: "The record successfully loaded",
    type: PromoEntity,
  })
  public getOne(@Param("id") id: number): Promise<PromoEntity> {
    return this.promosService.getOne(id);
  }

  @Post("/")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create promo",
    description: "This POST request should create promo",
  })
  @ApiResponse({
    status: 200,
    description: "The record successfully created",
    type: PromoEntity,
  })
  @UseGuards(AdminGuard)
  public create(@Body() body: PromoDto): Promise<PromoEntity> {
    return this.promosService.create(body);
  }

  @Patch("/:id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update promo",
    description: "This PATCH request should update promo by id",
  })
  @ApiResponse({
    status: 200,
    description: "The record successfully updated",
    type: PromoEntity,
  })
  @UseGuards(AdminGuard)
  public update(
    @Param("id") id: number,
    @Body() body: PromoDto,
  ): Promise<PromoEntity> {
    return this.promosService.update(id, body);
  }

  @Delete("/:id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete promo",
    description: "This DELETE request should delete promo by id",
  })
  @ApiResponse({
    status: 200,
    description: "The record successfully deleted",
    type: void 0,
  })
  @UseGuards(AdminGuard)
  public delete(@Param("id") id: number): Promise<void> {
    return this.promosService.delete(id);
  }
}
