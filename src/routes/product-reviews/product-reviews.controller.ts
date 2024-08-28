import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { BannerEntity } from "../../entities/banner.entity";
import { ProductReviewsResponseDto } from "../../core/dto/product-reviews/product-reviews.response.dto";
import { ProductReviewsService } from "./product-reviews.service";

@ApiTags("Product Reviews")
@Controller("product-reviews")
export class ProductReviewsController {
  constructor(private productReviewsService: ProductReviewsService) {}

  @Get("/:productId")
  @ApiOperation({
    summary: "Get product reviews",
    description:
      "This GET request should return all the reviews for specific product by product ID",
  })
  @ApiResponse({
    status: 200,
    description: "The records successfully found",
    type: ProductReviewsResponseDto,
  })
  getProductReviews(
    @Param("productId") productId: number,
  ): Promise<ProductReviewsResponseDto> {
    return this.productReviewsService.getProductReviews(productId);
  }
}
