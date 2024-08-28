import { ApiResponseProperty } from "@nestjs/swagger";
import { ResponseUser } from "../../interfaces/response-user";
import { AuthorizationResponse } from "../auth/authorization-response";

export class UserAuthResponseDto implements AuthorizationResponse {
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
      image: "/public/user/2/avatar.jpeg",
      created_at: "2011-10-05T14:48:00.000Z",
      updated_at: "2011-10-05T14:48:00.000Z",
    },
  })
  user: ResponseUser;
}
