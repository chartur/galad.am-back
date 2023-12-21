import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ResponseUser } from "../interfaces/response-user";

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ResponseUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
