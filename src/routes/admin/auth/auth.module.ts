import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminEntity } from "../../../entities/admin.entity";
import { JwtModule } from "@nestjs/jwt";
import { AdminService } from "../admin.service";
import { GuardsModule } from "../../../shared/guards/guards.module";

@Module({
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
    JwtModule.register({
      secret: "GALAD_AUTH_SECRET",
      signOptions: { expiresIn: "14d" },
    }),
    GuardsModule,
  ],
  providers: [AuthService, AdminService],
})
export class AuthModule {}
