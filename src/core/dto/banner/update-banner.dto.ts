import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateBannerDto {
  @ApiProperty({ required: true, description: "Armenian title" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  am_title: string;

  @ApiProperty({ required: true, description: "English title" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  en_title: string;

  @ApiProperty({ required: true, description: "Russian title" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  ru_title: string;

  @ApiProperty({ required: true, description: "Armenian description" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  am_description: string;

  @ApiProperty({ required: true, description: "English description" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  en_description: string;

  @ApiProperty({ required: true, description: "Russian description" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  ru_description: string;

  @ApiProperty({
    required: false,
    type: "string",
    format: "binary",
    description: "Image file",
  })
  @IsOptional()
  image: string;
}
