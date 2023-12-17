import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ENTITIES } from "../../entities";
import { AuthUserService } from "./auth-user.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
  exports: [AuthUserService],
  providers: [AuthUserService],
  imports: [
    TypeOrmModule.forFeature(ENTITIES),
    JwtModule.register({
      secret: "GALAD_AUTH_SECRET",
      signOptions: { expiresIn: "14d" },
    })
  ],
})
export class ServicesModule {}
