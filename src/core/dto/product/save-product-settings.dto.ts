import { IsBoolean, IsNumber, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class SaveProductSettingsDto {
  @ApiProperty({ required: false, description: "Category ID of product" })
  @IsOptional()
  @Transform((data) => Number(data.value))
  @IsNumber()
  category: number;

  @ApiProperty({
    required: false,
    description: "Is product marked as new arrival",
  })
  @IsOptional()
  @IsBoolean()
  is_new_arrival: boolean;
}
