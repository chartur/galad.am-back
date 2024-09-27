import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { PromoType } from "../../../models/enums/promo-type";
import { PromoUsageType } from "../../../models/enums/promo-usage-type";
import { Transform } from "class-transformer";

export class PromoDto {
  @ApiProperty({
    required: true,
    example: "PROMO1500",
    description: "Promo Code",
  })
  @IsString()
  code: string;

  @ApiProperty({ required: true, example: 1500, description: "Value of Promo" })
  @IsNumber()
  value: number;

  @ApiProperty({
    required: false,
    example: 7000,
    description: "Minimum order price count to apply the promo",
  })
  @Transform((param) => (param.value ? Number(param.value) : null))
  @IsOptional()
  @IsNumber()
  minOrderPrice: number;

  @ApiProperty({
    required: true,
    example: PromoType.FixedPrice,
    description: "Type of promo discount",
  })
  @IsEnum(PromoType)
  type: PromoType;

  @ApiProperty({
    required: true,
    example: PromoUsageType.OneTime,
    description: "Usage Type of promo discount",
  })
  @IsEnum(PromoUsageType)
  usageType: PromoUsageType;

  @ApiProperty({
    required: false,
    example: "2011-10-05T14:48:00.000Z",
    description: "The expiration datetime of promo",
  })
  @IsDateString()
  @IsOptional()
  expired_at: Date;

  @ApiProperty({
    required: true,
    example: false,
    description: "The activation status of promo",
  })
  @IsBoolean()
  @IsOptional()
  active: boolean;
}
