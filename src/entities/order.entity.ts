import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "./user.entity";
import { OrderStatus } from "../models/enums/order-status";
import { ProductEntity } from "./product.entity";
import { OrderProductEntity } from "./order-product.entity";

@Entity({ name: "orders" })
export class OrderEntity {
  @ApiProperty({
    example: "550e8400-e29b-41d4-a716-446655440000",
    description: "The unique UUID of order",
  })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({
    example: UserEntity,
    description: "The order owner user",
  })
  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn()
  user?: UserEntity;

  @ApiProperty({
    example: "john.alex@yopmail.com",
    description: "The email address of order creator",
  })
  @Column({ nullable: false })
  email: string;

  @ApiProperty({
    example: "+37477777777",
    description: "The phone number of order creator",
  })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({
    example: OrderStatus.Pending,
    description: "The status of order",
  })
  @Column({
    default: OrderStatus.Pending,
    type: "enum",
    enum: OrderStatus,
  })
  status: OrderStatus;

  @ApiProperty({
    example: "2500.00",
    description: "The total price of order calculated with discounts",
  })
  @Column()
  totalPrice: string;

  @ApiProperty({
    example: "2800.00",
    description:
      "The original price of order used original price of products (not calculated discounts)",
  })
  @Column()
  originalPrice: string;

  @ApiProperty({
    example: "300.00",
    description: "The total price of used discounts",
  })
  @Column()
  discounts: string;

  @ApiProperty({
    example: 3,
    description: "The quantity of ordered products",
  })
  @Column()
  totalQuantity: number;

  @ApiProperty({
    example: [OrderProductEntity, OrderProductEntity],
    description: "The order product details belongs to current order",
  })
  @OneToMany(() => OrderProductEntity, (orderProduct) => orderProduct.order, {
    nullable: true,
  })
  @JoinColumn()
  orderProducts?: OrderProductEntity[];

  @ApiProperty({
    example: "2011-10-05T14:48:00.000Z",
    description: "The creation date of order",
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    example: "2011-10-05T14:48:00.000Z",
    description: "The update date of order",
  })
  @UpdateDateColumn()
  updated_at: Date;
}
