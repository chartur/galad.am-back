import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { ProductEntity } from "./product.entity";

@Entity({ name: "tags" })
export class TagEntity {
  @ApiProperty({ example: 1, description: "The unique ID of tag" })
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty({
    example: [ProductEntity],
    description: "The products that have the current tag",
  })
  @ManyToMany(() => ProductEntity, (product) => product.tags)
  products?: ProductEntity[];

  @ApiProperty({
    example: "Սիրտ",
    description: "The Armenian name of tag",
  })
  @Column()
  am_name: string;

  @ApiProperty({
    example: "Heart",
    description: "The English name of tag",
  })
  @Column()
  en_name: string;

  @ApiProperty({
    example: "Сердце",
    description: "The Russian name of tag",
  })
  @Column()
  ru_name: string;

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
