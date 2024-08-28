import { ApiProperty } from "@nestjs/swagger";
import {FakeCommentEntity} from "../../../entities/fake-comment.entity";

export class ProductReviewDto {
  @ApiProperty({
    description: "The full name of review owner",
    example: "John smith",
  })
  userFullName: string;

  @ApiProperty({
    description: "The rating of the review",
    example: 4.5,
  })
  rating: number;

  @ApiProperty({
    description: "Product id that review belongs to",
    example: 15,
  })
  product: number;

  @ApiProperty({
    description: "User thoughts about product",
    example: "Good product, thank you.",
  })
  content?: string;

  @ApiProperty({
    description: "Review owner account image",
    example: "https://test.test/test.png",
  })
  userImage?: string;

  @ApiProperty({
    description: "Image that user left in the review",
    example: "/public/comments/test.jpg",
  })
  image?: string;

  static fromFakeComment(
    fComment: FakeCommentEntity,
    productId: number,
  ): ProductReviewDto {
    return {
      userFullName: fComment.userFullName,
      userImage: fComment.userImage,
      rating: fComment.rating,
      product: productId,
      content: fComment.content,
      image: fComment.image,
    };
  }
}
