import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import {ResponseAdmin, ResponseUser} from "../interfaces/response-user";

export const AuthAdmin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ResponseAdmin => {
    const request = ctx.switchToHttp().getRequest();
    return request.admin;
  },
);
