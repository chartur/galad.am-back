import { ApiResponseProperty } from "@nestjs/swagger";
import { AdminEntity } from "../../../entities/admin.entity";

export class AdminAuthResponseDto {
  @ApiResponseProperty({
    example: "ACCESS_TOKEN",
  })
  token: string;

  @ApiResponseProperty({
    example: {
      name: "John Alex",
      email: "john.alex@yopmail.com",
      created_at: "2011-10-05T14:48:00.000Z",
      updated_at: "2011-10-05T14:48:00.000Z",
    },
  })
  user: Omit<AdminEntity, "password" | "hashPassword">;
}
