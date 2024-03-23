import {
  AfterRemove,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ProductEntity } from "./product.entity";
import { ProductAssetType } from "../models/enums/product-asset-type";
import { ApiProperty } from "@nestjs/swagger";
import * as fs from "fs";

@Entity({ name: "product_assets" })
export class ProductAssetEntity {
  @ApiProperty({ example: 1, description: "The unique ID of asset" })
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty({
    example: ProductEntity,
    description: "The product that current asset belongs to",
  })
  @ManyToOne(() => ProductEntity, (product) => product.assets)
  product: ProductEntity;

  @ApiProperty({
    example: "/public/product/1/assets/test.png",
    description: "The link of asset file",
  })
  @Column()
  link: string;

  @ApiProperty({
    example: ProductAssetType.Photo,
    description: "The type of asset",
  })
  @Column({
    type: "enum",
    enum: ProductAssetType,
    nullable: false,
    default: ProductAssetType.Photo,
  })
  type: ProductAssetType;

  @ApiProperty({
    example: true,
    description: "Is the image mentioned as main image of product",
  })
  @Column({ default: false })
  is_main: boolean;

  @ApiProperty({
    example: "2011-10-05T14:48:00.000Z",
    description: "The creation date of asset",
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    example: "2011-10-05T14:48:00.000Z",
    description: "The update date of asset",
  })
  @UpdateDateColumn()
  updated_at: Date;

  @AfterRemove()
  removeAssetFile() {
    if (this.type === ProductAssetType.Photo) {
      fs.unlink(this.link, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  }
}
