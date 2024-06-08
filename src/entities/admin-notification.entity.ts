import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity("admin_notifications")
class AdminNotificationEntity {
  @ApiProperty({
    example: 1,
    description: "The unique ID of admin",
  })
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ApiProperty({
    example: "New Order",
    description: "The title of notification",
  })
  @Column()
  title: string;

  @ApiProperty({
    example: "You have new order to proceed",
    description: "The description content of notification",
  })
  @Column()
  content: string;

  @ApiProperty({
    example: "/order/1",
    description: "The link that should redirect to after notification click",
  })
  @Column()
  link: string;

  @ApiProperty({
    example: false,
    description: "The flag to detect if notification already seen",
  })
  @Column()
  seen: boolean;

  @ApiProperty({
    example: "2011-10-05T14:48:00.000Z",
    description: "The creation date of notification user",
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    example: "2011-10-05T14:48:00.000Z",
    description: "The update date of notification user",
  })
  @UpdateDateColumn()
  updated_at: Date;
}
