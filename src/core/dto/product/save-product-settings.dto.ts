import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { Gender } from "../../../models/enums/gender";

export class SaveProductSettingsDto {
  @ApiProperty({ required: false, description: "Category ID of product" })
  @Transform((data) => (data.value ? Number(data.value) : data.value))
  @IsNumber()
  category: number;

  @ApiProperty({
    required: false,
    description: "Is product marked as new arrival",
  })
  @IsOptional()
  @IsBoolean()
  is_new_arrival: boolean;

  @ApiProperty({
    required: false,
    description: "tag ID's for product",
  })
  @IsArray()
  @IsNumber({}, { each: true })
  tags: number[];

  @ApiProperty({
    required: false,
    description: "The gender of product",
  })
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;
}
