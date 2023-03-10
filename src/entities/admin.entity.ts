import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import * as bcrypt from "bcrypt";

export const ADMIN_USER_PASSWORD_SALT = 10;

@Entity({ name: "admins" })
export class AdminEntity {
  @ApiProperty({
    example: 1,
    description: "The unique ID of admin",
  })
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty({
    example: "John Alex",
    description: "The full name of admin user",
  })
  @Column()
  name: string;

  @ApiProperty({
    example: "john.alex@yopmail.com",
    description: "The email address of admin user",
  })
  @Column({ unique: true, nullable: false })
  email: string;

  @Column()
  password: string;

  @ApiProperty({
    example: "2011-10-05T14:48:00.000Z",
    description: "The creation date of admin user",
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    example: "2011-10-05T14:48:00.000Z",
    description: "The update date of admin user",
  })
  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, ADMIN_USER_PASSWORD_SALT);
  }
}
