import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UpdatePersonalSettingsRequestDto {
  @ApiProperty({ required: true, description: "User email address" })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, description: "User phone number" })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ required: true, description: "User full name" })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    required: false,
    type: "string",
    format: "binary",
    description: "User profile image file",
  })
  image: string;
}
