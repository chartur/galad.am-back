import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CategoryEntity } from "./category.entity";
import { ProductAssetEntity } from "./product-asset.entity";

@Entity({ name: "products" })
export class ProductEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @OneToOne(() => CategoryEntity)
  category: CategoryEntity;

  @OneToMany(() => ProductAssetEntity, (asset) => asset.product)
  assets: ProductAssetEntity[];

  @Column()
  am_name: string;

  @Column()
  en_name: string;

  @Column()
  ru_name: string;

  @Column()
  am_description: string;

  @Column()
  en_description: string;

  @Column()
  ru_description: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  new_price: number;

  @Column()
  is_active: boolean;

  @Column()
  available_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
