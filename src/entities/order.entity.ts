import {
  AfterInsert,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "./user.entity";
import { OrderStatus } from "../models/enums/order-status";
import { OrderProductEntity } from "./order-product.entity";
import * as crypto from "crypto";

@Entity({ name: "orders" })
export class OrderEntity {
  @ApiProperty({
    example: "550e8400-e29b-41d4-a716-446655440000",
    description: "The unique UUID of order",
  })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({
    example: 2,
    description: "The order number of order",
  })
  @Generated("increment")
  @Column({ unique: true, nullable: false })
  orderNumber: number;

  @ApiProperty({
    example: "GD0000003458",
    description: "The unique user friendly id of order",
  })
  @Column({
    generatedType: "STORED",
    asExpression: "'GD' || LPAD(\"orderNumber\"::text, 7, '0')",
    unique: true,
    nullable: false,
  })
  orderId: string;

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
  @Column({ type: "numeric", precision: 20, scale: 2 })
  totalPrice: number;

  @ApiProperty({
    example: "2800.00",
    description:
      "The original price of order used original price of products (not calculated discounts)",
  })
  @Column({ type: "numeric", precision: 20, scale: 2 })
  originalPrice: number;

  @ApiProperty({
    example: "300.00",
    description: "The total price of used discounts",
  })
  @Column({ type: "numeric", precision: 20, scale: 2 })
  discounts: number;

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
  @OneToMany(() => OrderProductEntity, (orderProduct) => orderProduct.order)
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

  @AfterInsert()
  generateOrderId(): void {
    const orderIdString = this.orderNumber.toString();
    const orderNumberLength = orderIdString.length;
    this.orderId = "GD";
    if (orderNumberLength < 10) {
      for (let i = 1; i <= 10 - orderNumberLength; i++) {
        this.orderId += "0";
      }
    }
    this.orderId += orderIdString;
  }
}
