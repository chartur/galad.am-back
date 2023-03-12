import {
  AfterRemove,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import * as fs from "fs";
import { BannerPosition } from "../models/enums/banner-position";

@Entity({ name: "banners" })
export class BannerEntity {
  @ApiProperty({ example: 1, description: "The unique ID of banner" })
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty({
    example: "Գեղեցիկ զարդեր",
    description: "The Armenian title of banner",
  })
  @Column()
  am_title: string;

  @ApiProperty({
    example: "Beautiful jewelry",
    description: "The English title of banner",
  })
  @Column()
  en_title: string;

  @ApiProperty({
    example: "Красивые украшения",
    description: "The Russian title of banner",
  })
  @Column()
  ru_title: string;

  @ApiProperty({
    example: "Արծաթյա զարդեր նրբաոճ քարերով և ունիկալ շղթաներով",
    description: "The Armenian description of banner",
  })
  @Column()
  am_description: string;

  @ApiProperty({
    example: "Silver jewelry with elegant stones and unique chains",
    description: "The English description of banner",
  })
  @Column()
  en_description: string;

  @ApiProperty({
    example:
      "Серебряные украшения с элегантными камнями и уникальными цепочками",
    description: "The Russian description of banner",
  })
  @Column()
  ru_description: string;

  @ApiProperty({
    example: "https://galad.am/assets/images/placeholders/banners/2.jpg",
    description: "The link of banner's image",
  })
  @Column()
  link: string;

  @ApiProperty({
    example: true,
    description: "Is banner presented in app",
  })
  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @ApiProperty({
    example: BannerPosition.Left,
    description: "Banner text content position (left/right)",
  })
  @Column({ type: "enum", enum: BannerPosition, default: BannerPosition.Left })
  text_position: BannerPosition;

  @ApiProperty({
    example: "2011-10-05T14:48:00.000Z",
    description: "The creation date of banner",
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    example: "2011-10-05T14:48:00.000Z",
    description: "The update date of banner",
  })
  @UpdateDateColumn()
  updated_at: Date;

  @AfterRemove()
  updateStatus() {
    fs.unlink(this.link, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
}
