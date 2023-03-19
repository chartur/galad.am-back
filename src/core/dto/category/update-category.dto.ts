import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto {
  @ApiProperty({ required: true, description: "Armenian name" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  am_name: string;

  @ApiProperty({ required: true, description: "English name" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  en_name: string;

  @ApiProperty({ required: true, description: "Russian name" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  ru_name: string;

  @ApiProperty({
    required: false,
    type: "string",
    format: "binary",
    description: "Image file",
  })
  @IsOptional()
  link: string;
}
