import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { PromoType } from "../models/enums/promo-type";
import { PromoUsageType } from "../models/enums/promo-usage-type";

@Entity({ name: "promos" })
export class PromoEntity {
  @ApiProperty({ example: 1, description: "The unique ID of promo code" })
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty({
    example: "PROMO15",
    description: "The promo code which user should input to get discount",
  })
  @Column({ unique: true })
  code: string;

  @ApiProperty({
    example: PromoType.Percentage,
    description: "The type of promo code discount (percent or fixed price)",
  })
  @Column({ type: "enum", enum: PromoType })
  type: PromoType;

  @ApiProperty({
    example: 15,
    description: "The discount size (percent or fixed price)",
  })
  @Column({ nullable: false })
  value: number;

  @ApiProperty({
    example: 15000,
    description: "The minimum price that order should be to apply the promo",
  })
  @Column({ nullable: true })
  minOrderPrice: number;

  @ApiProperty({
    example: PromoUsageType.OneTime,
    description: "Usage type of promo",
  })
  @Column({
    type: "enum",
    enum: PromoUsageType,
    default: PromoUsageType.OneTime,
  })
  usageType: PromoUsageType;

  @ApiProperty({
    example: true,
    description: "Is the promo active",
  })
  @Column({ type: "boolean", default: false })
  active: boolean;

  @ApiProperty({
    example: "2011-10-05T14:48:00.000Z",
    description: "The expiration datetime of promo",
  })
  @Column({ type: "timestamptz", nullable: true })
  expired_at: Date;

  @ApiProperty({
    example: "2011-10-05T14:48:00.000Z",
    description: "The creation date of tag",
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    example: "2011-10-05T14:48:00.000Z",
    description: "The update date of tag",
  })
  @UpdateDateColumn()
  updated_at: Date;
}
