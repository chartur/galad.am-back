import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SaveSeoDto {
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

  @ApiProperty({ required: true, description: "Armenian description" })
  @IsString()
  @IsNotEmpty()
  am_description: string;

  @ApiProperty({ required: true, description: "English description" })
  @IsString()
  @IsNotEmpty()
  en_description: string;

  @ApiProperty({ required: true, description: "Russian description" })
  @IsString()
  @IsNotEmpty()
  ru_description: string;

  @ApiProperty({ required: true, description: "Armenian Keywords" })
  @IsString()
  @IsNotEmpty()
  am_keywords: string;

  @ApiProperty({ required: true, description: "English keywords" })
  @IsString()
  @IsNotEmpty()
  en_keywords: string;

  @ApiProperty({ required: true, description: "Russian Keywords" })
  @IsString()
  @IsNotEmpty()
  ru_keywords: string;

  @ApiProperty({
    required: true,
    type: "string",
    format: "binary",
    description: "Image file",
  })
  image: string;
}
