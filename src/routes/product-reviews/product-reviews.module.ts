import { Module } from "@nestjs/common";
import { ProductReviewsService } from "./product-reviews.service";
import { ProductReviewsController } from "./product-reviews.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FakeCommentEntity } from "../../entities/fake-comment.entity";
import { ProductEntity } from "../../entities/product.entity";

@Module({
  controllers: [ProductReviewsController],
  providers: [ProductReviewsService],
  imports: [TypeOrmModule.forFeature([FakeCommentEntity, ProductEntity])],
})
export class ProductReviewsModule {}
