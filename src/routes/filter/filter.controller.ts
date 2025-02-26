import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProductEntity } from "../../entities/product.entity";
import { FilterRequestDto } from "../../core/dto/filter/filter.request.dto";
import { FilterService } from "./filter.service";

@ApiTags("Filter")
@Controller("filter")
export class FilterController {
  constructor(private filterService: FilterService) {}

  @ApiOperation({
    summary: "Filter Products",
    description: "GET request should get products by applied filter",
  })
  @ApiResponse({
    status: 200,
    type: [ProductEntity],
    description: "The record successfully loaded",
  })
  @Post("/")
  public filter(@Body() body: FilterRequestDto): Promise<ProductEntity[]> {
    return this.filterService.filter(body);
  }
}
