import { IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SaveProductValuesDto {
  @ApiProperty({ required: false, description: "Original price" })
  @IsOptional()
  @IsNumber()
  @Min(100)
  price: number;

  @ApiProperty({ required: false, description: "Discounted price" })
  @IsOptional()
  @IsNumber()
  new_price: number;

  @ApiProperty({ required: true, description: "Available count in stock" })
  @IsNotEmpty()
  @IsNumber()
  available_count: number;
}
