import { Injectable, Logger } from "@nestjs/common";
import { DataTablePayloadDto } from "../../core/dto/data-table-payload.dto";
import { PaginationResponseDto } from "../../core/dto/pagination-response.dto";
import { ILike, Raw, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { FakeCommentEntity } from "../../entities/fake-comment.entity";
import { SaveFakeCommentDto } from "../../core/dto/fake-comment/save-fake-comment.dto";
import { promisify } from "util";
import * as fs from "fs";
import { ProductEntity } from "../../entities/product.entity";
const unlinkPromise = promisify(fs.unlink);

@Injectable()
export class FakeCommentService {
  private readonly logger = new Logger(FakeCommentService.name);

  constructor(
    @InjectRepository(FakeCommentEntity)
    private fakeCommentEntityRepository: Repository<FakeCommentEntity>,
  ) {}

  public async getAll(
    query: DataTablePayloadDto,
  ): Promise<PaginationResponseDto<FakeCommentEntity>> {
    this.logger.log("[FakeComment] get all by search result", {
      query,
    });

    const whereCondition: any = {};

    const findOptions = {
      skip: (query.page - 1) * query.limit,
      take: query.limit < 0 ? undefined : query.limit,
      where: whereCondition,
    };

    if (query.filter) {
      findOptions["where"] = ["content"].map((column) => ({
        ...whereCondition,
        [column]: ILike(`%${query.filter.trim()}%`),
      }));
      findOptions["where"].push({
        id: Raw((alias) => `CAST(${alias} AS TEXT) ILike :filter`, {
          filter: `%${query.filter.trim()}%`,
        }),
      });
    }

    if (query.sortBy) {
      findOptions["order"] = {
        [query.sortBy]: query.order,
      };
    }

    const [data, count] = await this.fakeCommentEntityRepository.findAndCount({
      ...findOptions,
      relations: ["product"],
    });

    return {
      results: data,
      total: count,
    };
  }

  public getOne(id: number): Promise<FakeCommentEntity> {
    this.logger.log("[FakeComment] get one", {
      id,
    });

    return this.fakeCommentEntityRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ["product"],
    });
  }

  public create(
    body: SaveFakeCommentDto,
    file?: Express.Multer.File,
  ): Promise<FakeCommentEntity> {
    this.logger.log("[FakeComment] create new one", {
      body,
      file: file?.path,
    });

    const comment = this.fakeCommentEntityRepository.create(body);

    comment.product = {
      id: body.product,
    } as unknown as ProductEntity;

    if (file) {
      comment.image = file.path;
    }

    return this.fakeCommentEntityRepository.save(comment);
  }

  public async update(
    id: number,
    body: SaveFakeCommentDto,
    file?: Express.Multer.File,
  ): Promise<FakeCommentEntity> {
    this.logger.log("[FakeComment] update by id", {
      id,
      body,
      file: file?.path,
    });

    const comment = await this.fakeCommentEntityRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ["product"],
    });

    if (comment?.product?.id !== body.product.id) {
      comment.product = {
        id: body.product,
      } as unknown as ProductEntity;
    }

    if (file) {
      if (comment?.image !== file.path) {
        await unlinkPromise(comment.image);
      }
      comment.image = file.path;
    }

    return this.fakeCommentEntityRepository.save({
      ...comment,
      ...body,
    });
  }

  public delete(id: number): Promise<void> {
    this.logger.log("[FakeComment] delete by id", {
      id: id,
    });

    return this.fakeCommentEntityRepository.delete({ id }).then();
  }
}
