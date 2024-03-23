import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { OrderEntity } from "../../entities/order.entity";
import { CreateOrderDto } from "../../core/dto/order/create-order.dto";
import { OrderService } from "./order.service";
import { AuthUser } from "../../core/decorators/auth-user.decorator";
import { ResponseUser } from "../../core/interfaces/response-user";
import { OptionalAuthGuard } from "../../shared/guards/optional-auth.guard";
import { AdminGuard } from "../../shared/guards/admin.guard";
import { ApiPaginatedResponse } from "../../core/decorators/api-paginated-response";
import { PaginationResponseDto } from "../../core/dto/pagination-response.dto";
import { OrderFilterDto } from "../../core/dto/order/order-filter.dto";
import { ProductEntity } from "../../entities/product.entity";

@ApiTags("Order")
@ApiExtraModels(PaginationResponseDto)
@Controller("order")
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({
    summary: "Create an order",
    description: "This POST request should create an order",
  })
  @ApiResponse({
    status: 200,
    description: "Record sucessfully created",
    type: OrderEntity,
  })
  create(
    @AuthUser() authUser: ResponseUser,
    @Body() body: CreateOrderDto,
  ): Promise<OrderEntity> {
    return this.orderService.create(body, authUser);
  }

  @Post("get-all")
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: "Get all orders",
    description: "This POST request should load all orders by filter an order",
  })
  @ApiPaginatedResponse({
    model: OrderEntity,
    total: 3,
  })
  getAll(
    @Body() body: OrderFilterDto,
  ): Promise<PaginationResponseDto<OrderEntity>> {
    return this.orderService.getAll(body);
  }

  @Get(":id")
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: "Get order by ID",
    description: "This GET request should load an order by ID",
  })
  @ApiResponse({
    status: 200,
    type: OrderEntity,
    description: "The record successfully found",
  })
  getOne(@Param("id") orderId: string): Promise<OrderEntity> {
    return this.orderService.getOne(orderId);
  }
}
