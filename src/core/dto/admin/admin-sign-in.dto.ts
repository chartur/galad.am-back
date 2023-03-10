import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class AdminSignInDto {
  @ApiProperty({ required: true, description: "Admin email credential" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: true,
    minimum: 6,
    description: "Admin password credential",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
