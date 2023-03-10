import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class SetActiveDto {
  @ApiProperty({ required: true, description: "Active state value" })
  @IsBoolean()
  active: boolean;
}
