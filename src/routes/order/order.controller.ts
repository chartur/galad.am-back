import {Body, Controller, Post, UseGuards} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { OrderEntity } from "../../entities/order.entity";
import { CreateOrderDto } from "../../core/dto/order/create-order.dto";
import { OrderService } from "./order.service";
import { AuthUser } from "../../core/decorators/auth-user.decorator";
import { ResponseUser } from "../../core/interfaces/response-user";
import {OptionalAuthGuard} from "../../shared/guards/optional-auth.guard";

@ApiTags("Order")
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
}
