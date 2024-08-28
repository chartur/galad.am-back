import { Injectable, Logger } from "@nestjs/common";
import { ProductReviewsResponseDto } from "../../core/dto/product-reviews/product-reviews.response.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { FakeCommentEntity } from "../../entities/fake-comment.entity";
import { Repository } from "typeorm";
import { ProductReviewDto } from "../../core/dto/product-reviews/product-review.dto";

@Injectable()
export class ProductReviewsService {
  private readonly logger = new Logger(ProductReviewsService.name);

  constructor(
    @InjectRepository(FakeCommentEntity)
    private fakeCommentRepository: Repository<FakeCommentEntity>,
  ) {}

  public async getProductReviews(
    productId: number,
  ): Promise<ProductReviewsResponseDto> {
    this.logger.log("[ProductReviews] get all by product ID", {
      productId,
    });

    const [fakeComments, count] = await this.fakeCommentRepository.findAndCount(
      {
        where: {
          product: {
            id: productId,
          },
        },
      },
    );

    const avarage = await this.fakeCommentRepository.average("rating", {
      product: {
        id: productId,
      },
    });

    return {
      count,
      rating: avarage,
      reviews: fakeComments.map((comment) =>
        ProductReviewDto.fromFakeComment(comment, productId),
      ),
    };
  }
}
