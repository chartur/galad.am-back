import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { LinkOpenHandler } from "../../../models/enums/link-open-handler";

export class CreateBannerDto {
  @ApiProperty({ required: false, description: "Armenian title" })
  @IsOptional()
  @IsString()
  am_title: string;

  @ApiProperty({ required: false, description: "English title" })
  @IsOptional()
  @IsString()
  en_title: string;

  @ApiProperty({ required: false, description: "Russian title" })
  @IsOptional()
  @IsString()
  ru_title: string;

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

  @ApiProperty({ required: false, description: "Armenian button text" })
  @IsOptional()
  @IsString()
  am_button_text: string;

  @ApiProperty({ required: false, description: "English button text" })
  @IsOptional()
  @IsString()
  en_button_text: string;

  @ApiProperty({ required: false, description: "Russian button text" })
  @IsOptional()
  @IsString()
  ru_button_text: string;

  @ApiProperty({ required: false, description: "Link of button" })
  @IsOptional()
  @IsString()
  button_link: string;

  @ApiProperty({ required: false, description: "Link open handler type" })
  @IsOptional()
  url_open_handle: LinkOpenHandler;

  @ApiProperty({
    required: true,
    type: "string",
    format: "binary",
    description: "Image file",
  })
  image: string;
}
