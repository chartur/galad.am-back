import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { ProductEntity } from "./product.entity";
import { OrderEntity } from "./order.entity";

@Entity({ name: "order_products" })
export class OrderProductEntity {
  @ApiProperty({
    example: 1,
    description: "The unique ID of entity",
  })
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty({
    example: ProductEntity,
    description: "The product item",
  })
  @ManyToOne(() => ProductEntity)
  @JoinColumn()
  product: ProductEntity;

  @ApiProperty({
    example: OrderEntity,
    description: "The order which this item belongs to",
  })
  @ManyToOne(() => OrderEntity)
  @JoinColumn()
  order: OrderEntity;

  @ApiProperty({
    example: 3,
    description: "The quantity of ordered product",
  })
  @Column()
  quantity: number;

  @ApiProperty({
    example: "800.00",
    description: "The price which used for order the product",
  })
  @Column({ type: "numeric", precision: 20, scale: 2 })
  price: number;

  @ApiProperty({
    example: "800.00",
    description: "The price which used for order the product",
  })
  @Column({ type: "numeric", precision: 20, scale: 2 })
  totalPrice: number;

  @ApiProperty({
    example: "2011-10-05T14:48:00.000Z",
    description: "The creation date of order product",
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    example: "2011-10-05T14:48:00.000Z",
    description: "The update date of order product",
  })
  @UpdateDateColumn()
  updated_at: Date;
}
