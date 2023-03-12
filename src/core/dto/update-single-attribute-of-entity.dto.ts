import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateSingleAttributeOfEntityDto<Entity, T> {
  @ApiProperty({
    required: true,
    description: "Property name for update record",
  })
  @IsNotEmpty()
  property: keyof Entity;

  @ApiProperty({
    required: true,
    description: "Property value for update record",
  })
  @IsNotEmpty()
  value: T;
}
