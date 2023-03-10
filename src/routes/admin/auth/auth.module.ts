import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  ADMIN_USER_PASSWORD_SALT,
  AdminEntity,
} from "../../../entities/admin.entity";
import { ServicesModule } from "../../../shared/services/services.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
    ServicesModule,
    JwtModule.register({
      secret: "ADMIN_USER",
      signOptions: { expiresIn: "14d" },
    }),
  ],
  providers: [AuthService],
})
export class AuthModule {}
