import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SaveProductContentDto {
  @ApiProperty({ required: true, description: "Armenian name" })
  @IsString()
  @IsNotEmpty()
  am_name: string;

  @ApiProperty({ required: false, description: "English name" })
  @IsOptional()
  @IsString()
  en_name: string;

  @ApiProperty({ required: false, description: "Russian title" })
  @IsOptional()
  @IsString()
  ru_name: string;

  @ApiProperty({ required: false, description: "Armenian description" })
  @IsOptional()
  @IsString()
  am_description: string;

  @ApiProperty({ required: false, description: "English description" })
  @IsOptional()
  @IsString()
  en_description: string;

  @ApiProperty({ required: false, description: "Russian description" })
  @IsOptional()
  @IsString()
  ru_description: string;
}
