import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ProductEntity } from "./product.entity";
import { ProductAssetType } from "../models/enums/product-asset-type";

@Entity({ name: "product-assets" })
export class ProductAssetEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ManyToOne(() => ProductEntity, (product) => product.assets)
  product: ProductEntity;

  @Column()
  link: string;

  @Column()
  type: ProductAssetType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
