import { DataTableOrderType } from "../../models/enums/data-table-order-type";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class DataTablePayloadDto {
  @ApiProperty({
    required: false,
    description: "Records count per request",
    type: "number",
  })
  @IsOptional()
  @Transform((param) => Number(param.value))
  @IsNumber()
  limit = 10;

  @ApiProperty({
    required: false,
    description: "Current page of request pagination",
    type: "number",
  })
  @IsOptional()
  @Transform((param) => Number(param.value))
  @IsNumber()
  page = 1;

  @ApiProperty({
    required: false,
    description: "Sorting records result descending or ascending order",
    enum: DataTableOrderType,
  })
  @IsOptional()
  @IsEnum(DataTableOrderType)
  order?: DataTableOrderType = DataTableOrderType.ASC;

  @ApiProperty({
    required: false,
    description: "Records result should be sorted by sorted property",
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({
    required: false,
    description: "Manual search input",
  })
  @IsOptional()
  @IsString()
  filter?: string;
}
