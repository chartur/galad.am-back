import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ApiPaginatedResponse } from "../../core/decorators/api-paginated-response";
import { AdminGuard } from "../../shared/guards/admin.guard";
import { DataTablePayloadDto } from "../../core/dto/data-table-payload.dto";
import { PaginationResponseDto } from "../../core/dto/pagination-response.dto";
import { TagEntity } from "../../entities/tag.entity";
import { TagService } from "./tag.service";
import { CreateTagDto } from "../../core/dto/tag/create-tag.dto";
import { UpdateTagDto } from "../../core/dto/tag/update-tag.dto";

@ApiTags("Tags")
@Controller("tag")
export class TagController {
  constructor(private tagService: TagService) {}

  @Get("/")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get tags",
    description: "This GET request should return tags with pagination",
  })
  @ApiPaginatedResponse({
    model: TagEntity,
    total: 3,
  })
  public getTags(
    @Query() query: DataTablePayloadDto,
  ): Promise<PaginationResponseDto<TagEntity>> {
    return this.tagService.getTags(query);
  }

  @Get("/:id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get tag",
    description: "This GET request should return specific tag by ID",
  })
  @ApiResponse({
    status: 200,
    type: TagEntity,
    description: "The record successfully found",
  })
  @UseGuards(AdminGuard)
  public getTagById(@Param("id") tagId: number): Promise<TagEntity> {
    return this.tagService.getTagById(tagId);
  }

  @Post("/")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create tag",
    description: "This POST request should create new tag",
  })
  @ApiResponse({
    status: 200,
    type: TagEntity,
    description: "The record successfully created",
  })
  @UseGuards(AdminGuard)
  public createTag(@Body() body: CreateTagDto): Promise<TagEntity> {
    return this.tagService.createTag(body);
  }

  @Put("/:id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update tag",
    description: "This PUT request should update specific tag by ID",
  })
  @ApiResponse({
    status: 200,
    type: TagEntity,
    description: "The record successfully updated",
  })
  @UseGuards(AdminGuard)
  public updateTag(
    @Param("id") tagId: number,
    @Body() body: UpdateTagDto,
  ): Promise<TagEntity> {
    return this.tagService.updateTag(tagId, body);
  }

  @Delete("/:id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete tag",
    description: "This DELETE request should delete specific tag by ID",
  })
  @ApiResponse({
    status: 200,
    description: "The record successfully deleted",
  })
  @UseGuards(AdminGuard)
  public deleteTag(@Param("id") tagId: number): Promise<void> {
    return this.tagService.deleteTag(tagId);
  }
}
