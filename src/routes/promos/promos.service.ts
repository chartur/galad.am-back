import { Injectable, Logger } from "@nestjs/common";
import { DataTablePayloadDto } from "../../core/dto/data-table-payload.dto";
import { PaginationResponseDto } from "../../core/dto/pagination-response.dto";
import { ILike, Repository } from "typeorm";
import * as _ from "lodash";
import { PromoEntity } from "../../entities/promo.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { PromoDto } from "../../core/dto/promo/promo.dto";

@Injectable()
export class PromosService {
  private readonly logger = new Logger(PromosService.name);

  constructor(
    @InjectRepository(PromoEntity)
    private readonly promoEntityRepository: Repository<PromoEntity>,
  ) {}

  public async getAll(
    query: DataTablePayloadDto,
  ): Promise<PaginationResponseDto<PromoEntity>> {
    this.logger.log("[Promos] get all by search result", {
      query,
    });

    const whereCondition: any = query.props || {};

    const findOptions = {
      skip: (query.page - 1) * query.limit,
      take: query.limit < 0 ? undefined : query.limit,
      where: whereCondition,
    };

    if (query.filter) {
      findOptions["where"] = ["code"].map((column) => ({
        ...whereCondition,
        [column]: ILike(`%${query.filter.trim()}%`),
      }));
    }

    if (query.sortBy) {
      findOptions["order"] = _.set({}, query.sortBy, query.order);
    }

    const [data, count] = await this.promoEntityRepository.findAndCount({
      ...findOptions,
    });

    return {
      results: data,
      total: count,
    };
  }

  public getOne(id: number): Promise<PromoEntity> {
    this.logger.log("[Promos] get by id", {
      id,
    });

    return this.promoEntityRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  public getByCode(code: string): Promise<PromoEntity> {
    this.logger.log("[Promos] get by code", {
      code,
    });

    return this.promoEntityRepository.findOneOrFail({
      where: {
        code,
        active: true,
      },
    });
  }

  public create(body: PromoDto): Promise<PromoEntity> {
    this.logger.log("[Promos] create", {
      body,
    });

    const promoEntity = this.promoEntityRepository.create(body);
    return this.promoEntityRepository.save(promoEntity);
  }

  public update(id: number, body: PromoDto): Promise<PromoEntity> {
    this.logger.log("[Promos] update", {
      id,
      body,
    });

    const promoEntity = this.promoEntityRepository.findOneOrFail({
      where: {
        id,
      },
    });
    return this.promoEntityRepository.save({
      ...promoEntity,
      ...body,
      id,
    });
  }

  public async delete(id: number): Promise<void> {
    this.logger.log("[Promos] delete", {
      id,
    });

    await this.promoEntityRepository.delete({ id });
  }
}
