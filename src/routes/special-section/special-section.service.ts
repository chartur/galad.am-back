import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { SpecialSectionStatus } from "../../models/enums/special-section-status";
import { SpecialSectionEntity } from "../../entities/special-section.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { CreateSpecialSectionDto } from "../../core/dto/special-section/create-special-section.dto";
import { SpecialSectionRepository } from "../../repositories/special-section.repository";
import { PaginationResponseDto } from "../../core/dto/pagination-response.dto";
import { DataTablePayloadDto } from "../../core/dto/data-table-payload.dto";
import { TitleColumnsLanguages } from "../../core/constants/title-columns.languages";
import { UpdateSpecialSectionDto } from "../../core/dto/special-section/update-special-section.dto";

@Injectable()
export class SpecialSectionService {
  private readonly logger = new Logger(SpecialSectionService.name);

  constructor(
    @InjectRepository(SpecialSectionEntity)
    private specialSectionEntityRepository: Repository<SpecialSectionEntity>,
  ) {}

  public getActiveSections(): Promise<SpecialSectionEntity[]> {
    this.logger.log("[SpecialSection] get actives");

    return this.specialSectionEntityRepository.find({
      where: {
        status: SpecialSectionStatus.Active,
      },
    });
  }

  public async getSectionsByStatus(
    status: SpecialSectionStatus,
    query: DataTablePayloadDto,
  ): Promise<PaginationResponseDto<SpecialSectionEntity>> {
    this.logger.log("[SpecialSection] find by status", {
      status,
      query,
    });

    const whereCondition: any = {
      status: status,
    };

    const findOptions = {
      skip: (query.page - 1) * query.limit,
      take: query.limit < 0 ? undefined : query.limit,
      where: whereCondition,
    };

    if (query.filter) {
      findOptions["where"] = [...TitleColumnsLanguages].map((column) => ({
        ...whereCondition,
        [column]: Like(`%${query.filter}%`),
      }));
    }

    if (query.sortBy) {
      findOptions["order"] = {
        [query.sortBy]: query.order,
      };
    }

    const [data, count] =
      await this.specialSectionEntityRepository.findAndCount({
        ...findOptions,
      });

    return {
      results: data,
      total: count,
    };
  }

  public async getSectionById(id: number): Promise<SpecialSectionEntity> {
    this.logger.log("[SpecialSection] find by id", {
      id,
    });

    return this.specialSectionEntityRepository.findOneOrFail({
      where: {
        id,
      },
      relations: {
        products: {
          assets: true,
          category: true,
        },
      },
    });
  }

  public async createNewSection(
    body: CreateSpecialSectionDto,
  ): Promise<SpecialSectionEntity> {
    this.logger.log("[SpecialSection] create new one", body);

    let section = this.specialSectionEntityRepository.create({
      ...body,
      products: body.products.map((id) => ({ id })),
    });
    section = await this.specialSectionEntityRepository.save(section);

    return this.specialSectionEntityRepository.findOneOrFail({
      where: {
        id: section.id,
      },
      relations: {
        products: {
          assets: true,
          category: true,
        },
      },
    });
  }

  public async updateSectionById(
    id: number,
    body: UpdateSpecialSectionDto,
  ): Promise<SpecialSectionEntity> {
    this.logger.log("[SpecialSection] update by id", {
      id,
      body,
    });

    const section = await this.specialSectionEntityRepository.findOneOrFail({
      where: {
        id,
      },
      relations: {
        products: true,
      },
    });

    if (!body.products.length) {
      body.products = section.products.map((product) => product.id);
    }

    await this.specialSectionEntityRepository.save({
      ...section,
      products: [],
    });

    await this.specialSectionEntityRepository.save({
      ...section,
      ...body,
      products: body.products.map((id) => ({ id })),
    });

    return this.specialSectionEntityRepository.findOneOrFail({
      where: {
        id: section.id,
      },
      relations: {
        products: {
          assets: true,
          category: true,
        },
      },
    });
  }

  public async activateSection(id: number): Promise<SpecialSectionEntity> {
    this.logger.log("[SpecialSection] activate", {
      id,
    });

    const section = await this.specialSectionEntityRepository.findOneOrFail({
      where: {
        id,
      },
      relations: {
        products: true,
      },
    });

    const sectionValidation =
      SpecialSectionRepository.isSpecialSectionValidToActivate(section);

    if (sectionValidation) {
      throw new BadRequestException(sectionValidation);
    }

    return this.specialSectionEntityRepository.save({
      ...section,
      status: SpecialSectionStatus.Active,
    });
  }

  public async disableSection(id: number): Promise<SpecialSectionEntity> {
    this.logger.log("[SpecialSection] disable", {
      id,
    });

    const section = await this.specialSectionEntityRepository.findOneByOrFail({
      id,
    });

    return this.specialSectionEntityRepository.save({
      ...section,
      status: SpecialSectionStatus.Inactive,
    });
  }
}
