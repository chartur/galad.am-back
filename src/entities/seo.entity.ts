import {
  AfterRemove,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import fs from "fs";
import { SeoPages } from "../models/enums/seo-pages";

@Entity({ name: "seo_data" })
export class SeoEntity {
  @ApiProperty({ example: 1, description: "The unique ID of SEO" })
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty({
    example: SeoPages.HomePage,
    description: "The page name",
  })
  @Column({ type: "enum", enum: SeoPages, nullable: false, unique: true })
  page: SeoPages;

  @ApiProperty({
    example: "Էջի վերնագիր",
    description: "The Armenian title of page",
  })
  @Column({ nullable: false })
  am_title: string;

  @ApiProperty({
    example: "Заголовок страницы",
    description: "The Russian title of page",
  })
  @Column({ nullable: false })
  ru_title: string;

  @ApiProperty({
    example: "Page title",
    description: "The English title of page",
  })
  @Column({ nullable: false })
  en_title: string;

  @ApiProperty({
    example: "Էջի բանալի բառեր",
    description: "The Armenian keywords of page",
  })
  @Column({ nullable: false })
  am_keywords: string;

  @ApiProperty({
    example: "Ключевые слова страницы",
    description: "The Russian keywords of page",
  })
  @Column({ nullable: false })
  ru_keywords: string;

  @ApiProperty({
    example: "Page keywords",
    description: "The English keywords of page",
  })
  @Column({ nullable: false })
  en_keywords: string;

  @ApiProperty({
    example: "Էջի նկարագրություն",
    description: "The Armenian description of page",
  })
  @Column({ nullable: false })
  am_description: string;

  @ApiProperty({
    example: "Описание страницы",
    description: "The Russian description of page",
  })
  @Column({ nullable: false })
  ru_description: string;

  @ApiProperty({
    example: "Page description",
    description: "The English description of page",
  })
  @Column({ nullable: false })
  en_description: string;

  @ApiProperty({
    example: "/public/seo/home/test.png",
    description: "The link of image file",
  })
  @Column()
  image: string;

  @ApiProperty({
    example: "2011-10-05T14:48:00.000Z",
    description: "The creation date of seo data",
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    example: "2011-10-05T14:48:00.000Z",
    description: "The update date of seo data",
  })
  @UpdateDateColumn()
  updated_at: Date;

  @AfterRemove()
  removeAssetFile() {
    fs.unlink(this.image, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
}
