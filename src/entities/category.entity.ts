import {
  AfterRemove,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { CategoryStatus } from "../models/enums/category-status";
import fs from "fs";
import { ProductEntity } from "./product.entity";
import { ProductAssetEntity } from "./product-asset.entity";

@Entity({ name: "categories" })
export class CategoryEntity {
  @ApiProperty({ example: 1, description: "The unique ID of Category" })
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty({
    example: [ProductEntity, ProductEntity],
    description: "Products that belongs to current category",
  })
  @OneToMany(() => ProductEntity, (product) => product.category, {
    nullable: true,
  })
  @JoinColumn()
  products?: ProductEntity[];

  @ApiProperty({
    example: "Վզնոց",
    description: "The Armenian name of category",
  })
  @Column()
  am_name: string;

  @ApiProperty({
    example: "Necklace",
    description: "The English name of category",
  })
  @Column()
  en_name: string;

  @ApiProperty({
    example: "Ожерелье",
    description: "The Russian name of category",
  })
  @Column()
  ru_name: string;

  @ApiProperty({
    example: CategoryStatus.Active,
    description: "The status of category",
  })
  @Column({
    default: CategoryStatus.Active,
    type: "enum",
    enum: CategoryStatus,
  })
  status: CategoryStatus;

  @ApiProperty({
    example: "public/categories/eb7569a5a0f2c2efc1eee74b.jpeg",
    description: "The link of category's image",
  })
  @Column({
    nullable: true,
  })
  link: string;

  @ApiProperty({
    example: "2011-10-05T14:48:00.000Z",
    description: "The creation date of category",
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    example: "2011-10-05T14:48:00.000Z",
    description: "The update date of category",
  })
  @UpdateDateColumn()
  updated_at: Date;

  @AfterRemove()
  removeCategoryImage() {
    fs.unlink(this.link, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
}

export interface CategoryWithProductsCount extends CategoryEntity {
  products_count: string;
}
