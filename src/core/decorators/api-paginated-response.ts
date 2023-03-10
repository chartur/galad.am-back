import { applyDecorators, Type } from "@nestjs/common";
import { ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { PaginationResponseDto } from "../dto/pagination-response.dto";

interface ApiPaginatedResponseProp<TModel> {
  model: TModel;
  total: number;
}

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  data: ApiPaginatedResponseProp<TModel>,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationResponseDto) },
          {
            properties: {
              results: {
                type: "array",
                items: { $ref: getSchemaPath(data.model) },
              },
              total: {
                type: "number",
                example: data.total,
              },
            },
          },
        ],
      },
    }),
  );
};
