import {
  AfterRemove,
  Column,
  Entity, JoinColumn,
  ManyToMany, ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import fs from "fs";
import { ProductEntity } from "./product.entity";

@Entity("fake_comments")
export class FakeCommentEntity {
  @ApiProperty({ example: 1, description: "The unique ID of fake comment" })
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty({
    example: "John Smith",
    description: "The full name of comment owner",
  })
  @Column({
    nullable: false,
  })
  userFullName: string;

  @ApiProperty({
    example: 4.7,
    description: "The rating of fake review",
  })
  @Column({
    nullable: false,
  })
  rating: number;

  @ApiProperty({
    example: "https://test.ord/images/1.png",
    description: "The profile image address of fake user",
  })
  @Column({
    nullable: true,
  })
  userImage: string;

  @ApiProperty({
    example: "John Smith",
    description: "The full name of fake user",
  })
  @Column({
    nullable: true,
  })
  content: string;

  @ApiProperty({
    example: "https://test.ord/images/1.png",
    description: "The profile image address of fake comment",
  })
  @Column({
    nullable: true,
  })
  image: string;

  @ApiProperty({
    type: () => ProductEntity,
    example: ProductEntity,
    description: "The product which the comment belongs to",
  })
  @ManyToOne(() => ProductEntity, { nullable: false })
  @JoinColumn()
  product: ProductEntity;

  @AfterRemove()
  removeCategoryImage() {
    fs.unlink(this.image, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
}
