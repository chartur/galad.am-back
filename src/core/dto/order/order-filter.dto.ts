import {DataTablePayloadDto} from "../data-table-payload.dto";
import {OrderStatus} from "../../../models/enums/order-status";
import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsNumber, IsOptional} from "class-validator";
import {Transform} from "class-transformer";

export class OrderFilterDto extends DataTablePayloadDto {
  @ApiProperty({
    required: false,
    description: "Status list of orders",
    type: "enum",
    example: [OrderStatus.Pending, OrderStatus.Confirmed],
  })
  @IsOptional()
  @IsArray()
  statuses?: OrderStatus[];

  @ApiProperty({
    required: false,
    description: "Total low price of order",
    type: "number",
  })
  @IsOptional()
  @Transform((param) => Number(param.value))
  @IsNumber()
  priceLow: number;

  @ApiProperty({
    required: false,
    description: "Total high price of order",
    type: "number",
  })
  @IsOptional()
  @Transform((param) => Number(param.value))
  @IsNumber()
  priceHigh: number;

  @ApiProperty({
    required: false,
    description: "Product IDs included in the order",
    type: "number",
    example: [1, 2],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  products: number[];
}
