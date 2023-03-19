import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ProductAssetEntity } from "../../../entities/product-asset.entity";
import { Transform } from "class-transformer";

export class SaveProductAssetsDto {
  @ApiProperty({
    required: false,
    description: "Product video. Should be Youtube video ID",
  })
  @IsOptional()
  video: string;

  @ApiProperty({
    required: false,
    description: "New photos that need to be uploaded for product",
    format: "binary",
  })
  @IsOptional()
  newPhotos: string[];

  @ApiProperty({
    required: false,
    description:
      "Previously uploaded photos of product. Should be list of IDs ProductAssetEntity",
  })
  @IsOptional()
  @IsArray()
  @Transform((data) => data.value.map((item) => Number(item)))
  @IsNumber({}, { each: true })
  oldPhotos: number[];
}
