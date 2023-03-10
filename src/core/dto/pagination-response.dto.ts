import { ApiResponseProperty } from "@nestjs/swagger";

export class PaginationResponseDto<T> {
  @ApiResponseProperty({
    example: [
      {
        name: "John Alex",
        email: "john.alex@yopmail.com",
        created_at: "2011-10-05T14:48:00.000Z",
        updated_at: "2011-10-05T14:48:00.000Z",
      },
    ],
  })
  results: T[];

  @ApiResponseProperty({
    example: 3,
  })
  total: number;
}
