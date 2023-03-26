import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSpecialSectionDto {
  @ApiProperty({ required: true, description: "Armenian title" })
  @IsString()
  @IsNotEmpty()
  am_title: string;

  @ApiProperty({ required: true, description: "English title" })
  @IsString()
  @IsNotEmpty()
  en_title: string;

  @ApiProperty({ required: true, description: "Russian title" })
  @IsString()
  @IsNotEmpty()
  ru_title: string;

  @ApiProperty({ required: true, description: "ID of products" })
  @IsArray()
  @IsNumber({}, { each: true })
  products: number[];
}
