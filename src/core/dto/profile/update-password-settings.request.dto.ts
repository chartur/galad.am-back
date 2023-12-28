import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { Match } from "../../../utils/class-validator";

export class UpdatePasswordSettingsRequestDto {
  @ApiProperty({ required: true, description: "User password" })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: true, description: "User password confirmation" })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @Match("password")
  confirmPassword: string;
}
