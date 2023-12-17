import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class AuthUserLoginDto {
  @ApiProperty({ required: true, description: "User email credential" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: true,
    minimum: 6,
    description: "User password credential",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
