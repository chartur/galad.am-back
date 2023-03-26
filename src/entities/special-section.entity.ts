import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { SpecialSectionStatus } from "../models/enums/special-section-status";
import { ProductEntity } from "./product.entity";

@Entity({ name: "special_sections" })
export class SpecialSectionEntity {
  @ApiProperty({ example: 1, description: "The unique ID of section" })
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty({
    example: [ProductEntity],
    description: "The products section contains",
  })
  @ManyToMany(() => ProductEntity, (product) => product.specialSections, {
    nullable: true,
  })
  @JoinTable({
    name: "special_section_products",
    joinColumn: {
      name: "specialSectionId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "productId",
      referencedColumnName: "id",
    },
    synchronize: true,
  })
  products?: ProductEntity[];

  @ApiProperty({
    example: "Զեղչված տեսականի",
    description: "The Armenian title of section",
  })
  @Column()
  am_title: string;

  @ApiProperty({
    example: "Discounted assortment",
    description: "The English title of section",
  })
  @Column()
  en_title: string;

  @ApiProperty({
    example: "Ассортимент со скидкой",
    description: "The Russian title of section",
  })
  @Column()
  ru_title: string;

  @ApiProperty({
    example: SpecialSectionStatus.Active,
    description: "Is section presented in app",
  })
  @Column({
    type: "enum",
    enum: SpecialSectionStatus,
    default: SpecialSectionStatus.Inactive,
  })
  status: SpecialSectionStatus;

  @ApiProperty({
    example: "2011-10-05T14:48:00.000Z",
    description: "The creation date of section",
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    example: "2011-10-05T14:48:00.000Z",
    description: "The update date of section",
  })
  @UpdateDateColumn()
  updated_at: Date;
}
