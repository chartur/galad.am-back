import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "categories" })
export class CategoryEntity {
  @ApiProperty({ example: 1, description: "The unique ID of Category" })
  @PrimaryGeneratedColumn("increment")
  id: number;

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
    example: true,
    description: "The state of category",
  })
  @Column()
  is_active: boolean;

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
}
