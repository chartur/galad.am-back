import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { AUTH_SECRET, UserEntity } from "../../entities/user.entity";

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return false;
    }

    const user = this.jwtService.verify<UserEntity>(token, {
      secret: AUTH_SECRET,
    });

    if (!user) {
      return false;
    }

    const { exp, iat, ...payload } = user as any;

    request["user"] = payload;
    return true;
  }
}
