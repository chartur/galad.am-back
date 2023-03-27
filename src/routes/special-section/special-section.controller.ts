import {
  Body,
  Controller,
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
import { SpecialSectionService } from "./special-section.service";
import { SpecialSectionStatus } from "../../models/enums/special-section-status";
import { SpecialSectionEntity } from "../../entities/special-section.entity";
import { AdminGuard } from "../../shared/guards/admin.guard";
import { CreateSpecialSectionDto } from "../../core/dto/special-section/create-special-section.dto";
import { UpdateSpecialSectionDto } from "../../core/dto/special-section/update-special-section.dto";
import { ApiPaginatedResponse } from "../../core/decorators/api-paginated-response";
import { PaginationResponseDto } from "../../core/dto/pagination-response.dto";
import { DataTablePayloadDto } from "../../core/dto/data-table-payload.dto";

@ApiTags("SpecialSections")
@Controller("special-section")
export class SpecialSectionController {
  constructor(private specialSectionService: SpecialSectionService) {}

  @Get("/actives")
  @ApiOperation({
    summary: "Get active sections",
    description: "GET request should return all active special sections",
  })
  @ApiResponse({
    status: 200,
    type: [SpecialSectionEntity],
    description: "The records successfully found",
  })
  public getActiveSections(): Promise<SpecialSectionEntity[]> {
    return this.specialSectionService.getActiveSections();
  }

  @Get("/by-status/:status")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get sections by status",
    description: "GET request should return all special sections by status",
  })
  @ApiPaginatedResponse({
    model: SpecialSectionEntity,
    total: 3,
  })
  @UseGuards(AdminGuard)
  public getSectionsByStatus(
    @Param("status") status: SpecialSectionStatus,
    @Query() query: DataTablePayloadDto,
  ): Promise<PaginationResponseDto<SpecialSectionEntity>> {
    return this.specialSectionService.getSectionsByStatus(status, query);
  }

  @Get("/:id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get sections by id",
    description: "GET request should return a special section by id",
  })
  @ApiResponse({
    status: 200,
    type: SpecialSectionEntity,
    description: "The record successfully found",
  })
  @UseGuards(AdminGuard)
  public getSectionById(
    @Param("id") id: number,
  ): Promise<SpecialSectionEntity> {
    return this.specialSectionService.getSectionById(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create section",
    description: "POST request should create and return new special section",
  })
  @ApiResponse({
    status: 200,
    type: SpecialSectionEntity,
    description: "The record successfully created",
  })
  @UseGuards(AdminGuard)
  public createNewSection(
    @Body() body: CreateSpecialSectionDto,
  ): Promise<SpecialSectionEntity> {
    return this.specialSectionService.createNewSection(body);
  }

  @Post("/:id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update section",
    description: "POST request should update and return special section by ID",
  })
  @ApiResponse({
    status: 200,
    type: SpecialSectionEntity,
    description: "The record successfully updated",
  })
  @UseGuards(AdminGuard)
  public updateSectionById(
    @Param("id") id: number,
    @Body() body: UpdateSpecialSectionDto,
  ): Promise<SpecialSectionEntity> {
    return this.specialSectionService.updateSectionById(id, body);
  }

  @Put("/activate/:id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Activate section",
    description: "PUT request should activate and return special section by ID",
  })
  @ApiResponse({
    status: 200,
    type: SpecialSectionEntity,
    description: "The record successfully updated",
  })
  @UseGuards(AdminGuard)
  public activateSection(
    @Param("id") id: number,
  ): Promise<SpecialSectionEntity> {
    return this.specialSectionService.activateSection(id);
  }

  @Put("/disable/:id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Disable section",
    description: "PUT request should disable and return special section by ID",
  })
  @ApiResponse({
    status: 200,
    type: SpecialSectionEntity,
    description: "The record successfully updated",
  })
  @UseGuards(AdminGuard)
  public disableSection(
    @Param("id") id: number,
  ): Promise<SpecialSectionEntity> {
    return this.specialSectionService.disableSection(id);
  }
}
