import {
  Body,
  Controller, Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ApiPaginatedResponse } from "../../core/decorators/api-paginated-response";
import { AdminGuard } from "../../shared/guards/admin.guard";
import { DataTablePayloadDto } from "../../core/dto/data-table-payload.dto";
import { PaginationResponseDto } from "../../core/dto/pagination-response.dto";
import { FakeCommentService } from "./fake-comment.service";
import { FakeCommentEntity } from "../../entities/fake-comment.entity";
import { FileInterceptor } from "@nestjs/platform-express";
import { Uploader } from "../../utils/uploader";
import { DeleteUploadedFileOnErrorFilter } from "../../core/filters/delete-uploaded-file-on-error.filter";
import { SaveFakeCommentDto } from "../../core/dto/fake-comment/save-fake-comment.dto";

@ApiTags("Fake Comment")
@Controller("fake-comment")
export class FakeCommentController {
  constructor(private fakeCommentService: FakeCommentService) {}

  @Get("/")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get all fake comments",
    description:
      "This GET request should return all fake comments by pagination",
  })
  @ApiPaginatedResponse({
    model: FakeCommentEntity,
    total: 3,
  })
  @UseGuards(AdminGuard)
  public getAll(
    @Query() query: DataTablePayloadDto,
  ): Promise<PaginationResponseDto<FakeCommentEntity>> {
    return this.fakeCommentService.getAll(query);
  }

  @Get(":id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get fake comment by ID",
    description: "This GET request should return fake comment by provided ID",
  })
  @ApiResponse({
    status: 200,
    description: "The record successfully loaded",
    type: FakeCommentEntity,
  })
  @UseGuards(AdminGuard)
  public getOne(@Param("id") id: number): Promise<FakeCommentEntity> {
    return this.fakeCommentService.getOne(id);
  }

  @Post("/")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create new fake comment",
    description: "This POST request should create new fake comment feedback",
  })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({
    status: 200,
    description: "The record successfully saved",
    type: FakeCommentEntity,
  })
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileInterceptor("image", {
      storage: Uploader.fileStore(() => "./public/fcomments"),
    }),
  )
  @UseFilters(DeleteUploadedFileOnErrorFilter)
  public create(
    @Body() body: SaveFakeCommentDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" })],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ): Promise<FakeCommentEntity> {
    return this.fakeCommentService.create(body, file);
  }

  @Put(":id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update existing fake comment",
    description:
      "This PUT request should update existing fake comment feedback by ID",
  })
  @ApiConsumes("multipart/form-data")
  @ApiResponse({
    status: 200,
    description: "The record successfully saved",
    type: FakeCommentEntity,
  })
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileInterceptor("image", {
      storage: Uploader.fileStore(() => "./public/fcomments"),
    }),
  )
  @UseFilters(DeleteUploadedFileOnErrorFilter)
  public update(
    @Param("id") id: number,
    @Body() body: SaveFakeCommentDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" })],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ): Promise<FakeCommentEntity> {
    return this.fakeCommentService.update(id, body, file);
  }

  @Delete("/:id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete Fake Comment",
    description:
      "This DELETE request should delete specific fake comment by ID",
  })
  @ApiResponse({
    status: 200,
    description: "The record successfully deleted",
  })
  @UseGuards(AdminGuard)
  public delete(@Param("id") id: number): Promise<void> {
    return this.fakeCommentService.delete(id);
  }
}
