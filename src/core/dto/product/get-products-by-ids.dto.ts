import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber } from "class-validator";

export class GetProductsByIdsDto {
  @ApiProperty({
    required: false,
    description: "Product video. Should be Youtube video ID",
  })
  @IsArray()
  @IsNumber({}, { each: true })
  products: number[];
}
