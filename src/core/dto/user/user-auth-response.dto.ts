import { ApiResponseProperty } from "@nestjs/swagger";
import { UserEntity } from "../../../entities/user.entity";

export class UserAuthResponseDto {
  @ApiResponseProperty({
    example: "ACCESS_TOKEN",
  })
  token: string;

  @ApiResponseProperty({
    example: {
      name: "John Alex",
      email: "john.alex@yopmail.com",
      isActive: true,
      fbId: "12358893249",
      image: "/public/users/2/avatar.jpeg",
      created_at: "2011-10-05T14:48:00.000Z",
      updated_at: "2011-10-05T14:48:00.000Z",
    },
  })
  user: Omit<UserEntity, "password" | "hashPassword">;
}
