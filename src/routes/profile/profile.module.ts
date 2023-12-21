import { Module } from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GuardsModule } from "../../shared/guards/guards.module";
import { UserEntity } from "../../entities/user.entity";
import { ServicesModule } from "../../shared/services/services.module";

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    GuardsModule,
    ServicesModule,
  ],
})
export class ProfileModule {}
