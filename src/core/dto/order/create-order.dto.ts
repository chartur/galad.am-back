import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsObject, IsOptional, IsString } from "class-validator";

export class CreateOrderDto {
  @ApiProperty({
    required: false,
    example: "MYBIGPROMO",
    description: "The promo code for order discount",
  })
  @IsString()
  @IsOptional()
  promo: string;

  @ApiProperty({
    required: true,
    example: [{ quantity: 1, productId: 3 }],
    description: "The list of product ids and quantities",
  })
  @IsArray()
  products: OrderProduct[];

  @ApiProperty({
    required: true,
    example: [{ quantity: 1, productId: 3 }],
    description: "The email address and phone number order creator",
  })
  @IsObject()
  info: OrderContactInfo;
}

export interface OrderProduct {
  quantity: number;
  productId: number;
}

export interface OrderContactInfo {
  email: string;
  phone: string;
}
