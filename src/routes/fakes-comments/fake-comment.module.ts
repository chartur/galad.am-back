import { Module } from "@nestjs/common";
import { FakeCommentController } from "./fake-comment.controller";
import { FakeCommentService } from "./fake-comment.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GuardsModule } from "../../shared/guards/guards.module";
import { FakeCommentEntity } from "../../entities/fake-comment.entity";

@Module({
  controllers: [FakeCommentController],
  providers: [FakeCommentService],
  imports: [TypeOrmModule.forFeature([FakeCommentEntity]), GuardsModule],
})
export class FakeCommentModule {}
