import { ApiProperty } from "@nestjs/swagger";
import { ProductReviewDto } from "./product-review.dto";

export class ProductReviewsResponseDto {
  @ApiProperty({
    description: "Count of product reviews",
    example: 15,
  })
  count: number;

  @ApiProperty({
    description: "The average of the ratings of product",
    example: 4.3,
  })
  rating: number;

  @ApiProperty({
    description: "List of product reviews",
    example: [ProductReviewDto, ProductReviewDto],
  })
  reviews: ProductReviewDto[];
}
