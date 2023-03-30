import { Injectable, Logger } from "@nestjs/common";
import { DataTablePayloadDto } from "../../core/dto/data-table-payload.dto";
import { PaginationResponseDto } from "../../core/dto/pagination-response.dto";
import { NameColumnsLanguages } from "../../core/constants/name-columns.languages";
import { Like, Repository } from "typeorm";
import * as _ from "lodash";
import { InjectRepository } from "@nestjs/typeorm";
import { TagEntity } from "../../entities/tag.entity";
import { CreateTagDto } from "../../core/dto/tag/create-tag.dto";
import { UpdateTagDto } from "../../core/dto/tag/update-tag.dto";

@Injectable()
export class TagService {
  private readonly logger = new Logger(TagService.name);

  constructor(
    @InjectRepository(TagEntity)
    private tagEntityRepository: Repository<TagEntity>,
  ) {}

  public async getTags(
    query: DataTablePayloadDto,
  ): Promise<PaginationResponseDto<TagEntity>> {
    this.logger.log("[Tag] get all by search result", {
      query,
    });

    const whereCondition: any = {};

    const findOptions = {
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      where: whereCondition,
    };

    if (query.filter) {
      findOptions["where"] = [...NameColumnsLanguages].map((column) => ({
        ...whereCondition,
        [column]: Like(`%${query.filter}%`),
      }));
    }

    if (query.sortBy) {
      findOptions["order"] = _.set({}, query.sortBy, query.order);
    }

    const [data, count] = await this.tagEntityRepository.findAndCount({
      ...findOptions,
    });

    return {
      results: data,
      total: count,
    };
  }

  public getTagById(tagId: number): Promise<TagEntity> {
    this.logger.log("[Tag] Get one by id", {
      id: tagId,
    });

    return this.tagEntityRepository.findOneOrFail({
      where: {
        id: tagId,
      },
    });
  }

  public createTag(body: CreateTagDto): Promise<TagEntity> {
    this.logger.log("[Tag] create new one", body);

    const tag = this.tagEntityRepository.create(body);
    return this.tagEntityRepository.save(tag);
  }

  public updateTag(tagId: number, body: UpdateTagDto): Promise<TagEntity> {
    this.logger.log("[Tag] update tag by id", {
      id: tagId,
      body: body,
    });

    const tag = this.tagEntityRepository.findOneOrFail({
      where: {
        id: tagId,
      },
    });

    return this.tagEntityRepository.save({
      ...tag,
      ...body,
    });
  }

  public async deleteTag(tagId: number): Promise<void> {
    this.logger.log("[Tag] delete a tag", {
      id: tagId,
    });

    await this.tagEntityRepository.delete({ id: tagId });
  }
}
