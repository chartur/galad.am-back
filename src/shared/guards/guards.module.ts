import { Module } from "@nestjs/common";
import { AdminGuard } from "./admin.guard";
import { JwtModule, JwtService } from "@nestjs/jwt";

@Module({
  exports: [JwtModule, AdminGuard],
  imports: [
    JwtModule.register({
      secret: "GALAD_AUTH_SECRET",
      signOptions: { expiresIn: "14d" },
    }),
  ],
  providers: [JwtService, AdminGuard],
})
export class GuardsModule {}
