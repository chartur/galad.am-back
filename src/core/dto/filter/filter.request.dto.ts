import {IsArray, IsBoolean, IsNumber, IsOptional, IsString, Min} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {Gender} from "../../../models/enums/gender";

export class FilterRequestDto {
  @ApiProperty({
    required: false,
    description: "Category ID's list for filter",
  })
  @IsArray()
  @IsOptional()
  category?: number[];

  @ApiProperty({ required: false, description: "Gender type of products" })
  @IsArray()
  @IsOptional()
  gender?: Gender[];

  @ApiProperty({ required: false, description: "Minimum price for filter" })
  @IsNumber()
  @IsOptional()
  @Min(0)
  minPrice?: number;

  @ApiProperty({ required: false, description: "Maximum price for filter" })
  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @ApiProperty({
    required: false,
    description: "Tag ID's list for filter",
  })
  @IsArray()
  @IsOptional()
  tags?: number[];

  @ApiProperty({
    required: false,
    description: "Discount state",
  })
  @IsOptional()
  @IsBoolean()
  sale?: boolean;

  @ApiProperty({
    required: false,
    description: "Text for search by string",
  })
  @IsOptional()
  @IsString()
  q?: string;
}
