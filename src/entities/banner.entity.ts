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
import { LinkOpenHandler } from "../models/enums/link-open-handler";

@Entity({ name: "banners" })
export class BannerEntity {
  @ApiProperty({ example: 1, description: "The unique ID of banner" })
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty({
    example: "Գեղեցիկ զարդեր",
    description: "The Armenian title of banner",
  })
  @Column({
    nullable: true,
  })
  am_title: string;

  @ApiProperty({
    example: "Beautiful jewelry",
    description: "The English title of banner",
  })
  @Column({
    nullable: true,
  })
  en_title: string;

  @ApiProperty({
    example: "Красивые украшения",
    description: "The Russian title of banner",
  })
  @Column({
    nullable: true,
  })
  ru_title: string;

  @ApiProperty({
    example: "Արծաթյա զարդեր նրբաոճ քարերով և ունիկալ շղթաներով",
    description: "The Armenian description of banner",
  })
  @Column({
    nullable: true,
  })
  am_description: string;

  @ApiProperty({
    example: "Silver jewelry with elegant stones and unique chains",
    description: "The English description of banner",
  })
  @Column({
    nullable: true,
  })
  en_description: string;

  @ApiProperty({
    example:
      "Серебряные украшения с элегантными камнями и уникальными цепочками",
    description: "The Russian description of banner",
  })
  @Column({
    nullable: true,
  })
  ru_description: string;

  @ApiProperty({
    example: "Տեսնել ավելին",
    description: "The Armenian text on the button",
  })
  @Column({ nullable: true })
  am_button_text: string;

  @ApiProperty({
    example: "See more",
    description: "The English text on the button",
  })
  @Column({ nullable: true })
  en_button_text: string;

  @ApiProperty({
    example: "Узнать больше",
    description: "The Russian text on the button",
  })
  @Column({ nullable: true })
  ru_button_text: string;

  @ApiProperty({
    example: "public/banners/eb7569a5a0f2c2efc1eee74b.jpeg",
    description: "The link of banner's image",
  })
  @Column()
  link: string;

  @ApiProperty({
    example: "/filter?sale=true",
    description: "The redirection url of specific list of products page",
  })
  @Column({ nullable: true })
  button_link: string;

  @ApiProperty({
    example: LinkOpenHandler.Default,
    description: "Open link of banner with same or different browser tabs",
  })
  @Column({
    type: "enum",
    enum: LinkOpenHandler,
    default: LinkOpenHandler.Default,
  })
  url_open_handle: LinkOpenHandler;

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
  removeBannerImage() {
    fs.unlink(this.link, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
}
