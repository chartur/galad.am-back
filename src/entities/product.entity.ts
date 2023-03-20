import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CategoryEntity } from "./category.entity";
import { ProductAssetEntity } from "./product-asset.entity";
import { ProductStatus } from "../models/enums/product-status";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "products" })
export class ProductEntity {
  @ApiProperty({ example: 1, description: "The unique ID of product" })
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty({
    example: CategoryEntity,
    description: "The Category of product",
  })
  @ManyToOne(() => CategoryEntity, { nullable: true })
  @JoinColumn()
  category?: CategoryEntity;

  @ApiProperty({
    example: [ProductAssetEntity],
    description: "The assets list of product",
  })
  @OneToMany(() => ProductAssetEntity, (asset) => asset.product, {
    nullable: true,
  })
  @JoinColumn()
  assets?: ProductAssetEntity[];

  @ApiProperty({
    example: "Արծաթյա շղթա",
    description: "The Armenian name of product",
  })
  @Column({ nullable: true })
  am_name: string;

  @ApiProperty({
    example: "Silver chain",
    description: "The English name of product",
  })
  @Column({ nullable: true })
  en_name: string;

  @ApiProperty({
    example: "Серебряная цепочка",
    description: "The Russian name of product",
  })
  @Column({ nullable: true })
  ru_name: string;

  @ApiProperty({
    example: "Արծաթյա շղթա նրբաոճ քարերով",
    description: "The Armenian description of product",
  })
  @Column({ nullable: true })
  am_description: string;

  @ApiProperty({
    example: "Silver chain with elegant stones",
    description: "The English description of product",
  })
  @Column({ nullable: true })
  en_description: string;

  @ApiProperty({
    example: "Серебряная цепочка с элегантными камнями",
    description: "The Russian description of product",
  })
  @Column({ nullable: true })
  ru_description: string;

  @ApiProperty({
    example: 8500,
    description: "The original price of product",
  })
  @Column({ nullable: true, default: 0 })
  price: number;

  @ApiProperty({
    example: 6700,
    description: "The new price of product after discount",
  })
  @Column({ nullable: true })
  new_price: number;

  @ApiProperty({
    example: 3,
    description: "The available counts of product in stock",
  })
  @Column({ nullable: true, default: 0 })
  available_count: number;

  @ApiProperty({
    example: false,
    description: "The state is product new arrival",
  })
  @Column({ nullable: true, type: "boolean", default: false })
  is_new_arrival: boolean;

  @ApiProperty({
    example: ProductStatus.Active,
    description: "The status of product",
  })
  @Column({ type: "enum", enum: ProductStatus, default: ProductStatus.Draft })
  status: ProductStatus;

  @ApiProperty({
    example: "2011-10-05T14:48:00.000Z",
    description: "The creation date of product",
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    example: "2011-10-05T14:48:00.000Z",
    description: "The update date of product",
  })
  @UpdateDateColumn()
  updated_at: Date;
}
