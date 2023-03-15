export class PaginationResponseDto<T> {
  results: T[];
  total: number;
}
