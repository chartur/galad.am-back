import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from "class-validator";
import { Transform } from "class-transformer";

export class SaveFakeCommentDto {
  @ApiProperty({
    required: true,
    description: "The name of feedback owner",
    example: "John Smith",
  })
  @IsNotEmpty()
  @IsString()
  userFullName: string;

  @ApiProperty({
    required: true,
    description: "The rating of the feedback",
    example: 4.7,
  })
  @Transform((param) => Number(param.value))
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    required: true,
    description: "The product ID which the comment should belongs to",
    example: 3,
  })
  @Transform((param) => Number(param.value))
  @IsNumber()
  product: { id: number };

  @ApiProperty({
    required: false,
    description: "Comment content of the feedback",
    example: "Good product. I like it",
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    required: false,
    description: "The image url address for the owner",
    example: "https://test.test/img/test.png",
  })
  @Transform((param) => param.value || undefined)
  @IsOptional()
  @IsUrl()
  userImage?: string;

  @ApiProperty({
    required: false,
    type: "string",
    format: "binary",
    description: "Image file",
  })
  @IsOptional()
  image?: string;
}
