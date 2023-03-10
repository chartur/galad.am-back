import { Module } from "@nestjs/common";
import { AdminService } from "./admin/admin.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminEntity } from "../../entities/admin.entity";

@Module({
  exports: [AdminService],
  providers: [AdminService],
  imports: [TypeOrmModule.forFeature([AdminEntity])],
})
export class ServicesModule {}
