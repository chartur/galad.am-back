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
import { AuthUser } from "../core/interfaces/auth-user";

export const USER_PASSWORD_SALT = 10;
export const AUTH_SECRET = "CUSTOMER_AUTH_SECRET_KEY";

@Entity({ name: "users" })
export class UserEntity implements AuthUser {
  @ApiProperty({
    example: 1,
    description: "The unique ID of user",
  })
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty({
    example: "John Alex",
    description: "The full name of user",
  })
  @Column()
  fullName: string;

  @ApiProperty({
    example: "john.alex@yopmail.com",
    description: "The email address of user",
  })
  @Column({ unique: true, nullable: false })
  email: string;

  @ApiProperty({
    example: "+37477777777",
    description: "The phone number of user",
  })
  @Column({ unique: true, nullable: true })
  phone: string;

  @ApiProperty({
    example: "/public/user/2/avatar.jpeg",
    description: "The profile image path of user",
  })
  @Column({ nullable: true })
  image: string;

  @Column()
  password: string;

  @ApiProperty({
    example: "7671273469892943",
    description: "The facebook id of user",
  })
  @Column({ unique: true, nullable: true })
  fbId: string;

  @ApiProperty({
    example: true,
    description: "Activation state of user profile",
  })
  @Column({ type: "bool", default: false })
  isActive: boolean;

  @ApiProperty({
    example: "2011-10-05T14:48:00.000Z",
    description: "The creation date of user",
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    example: "2011-10-05T14:48:00.000Z",
    description: "The update date of user",
  })
  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, USER_PASSWORD_SALT);
  }
}
