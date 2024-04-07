import {
  IsArray,
  IsDefined,
  IsNumber,
  Validate,
  ValidateNested,
} from "class-validator";
import { IsNumberOrString } from "../../utils/class-validator";
import { Type } from "class-transformer";

export class EntityOrderingItemDto {
  @IsDefined()
  @Validate(IsNumberOrString)
  entityId: number | string;

  @IsNumber()
  orderNumber: number;
}

export class EntityOrderingRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EntityOrderingItemDto)
  orders: EntityOrderingItemDto[];
}
