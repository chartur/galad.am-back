import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTagDto {
  @ApiProperty({ required: true, description: "Armenian name" })
  @IsString()
  @IsNotEmpty()
  am_name: string;

  @ApiProperty({ required: true, description: "English name" })
  @IsString()
  @IsNotEmpty()
  en_name: string;

  @ApiProperty({ required: true, description: "Russian name" })
  @IsString()
  @IsNotEmpty()
  ru_name: string;
}
