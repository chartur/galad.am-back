import { Module } from "@nestjs/common";
import { AdminGuard } from "./admin.guard";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { UserAuthGuard } from "./user-auth.guard";

@Module({
  exports: [JwtModule, AdminGuard, UserAuthGuard],
  imports: [
    JwtModule.register({
      secret: "GALAD_AUTH_SECRET",
      signOptions: { expiresIn: "14d" },
    }),
  ],
  providers: [JwtService, AdminGuard, UserAuthGuard],
})
export class GuardsModule {}
