import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { GuardsModule } from "../../../shared/guards/guards.module";
import { ServicesModule } from "../../../shared/services/services.module";

@Module({
  controllers: [AuthController],
  imports: [GuardsModule, ServicesModule],
  providers: [],
})
export class AuthModule {}
