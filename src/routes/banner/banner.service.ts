import { Injectable, Logger } from "@nestjs/common";
import { Like, Repository } from "typeorm";
import { BannerEntity } from "../../entities/banner.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateBannerDto } from "../../core/dto/banner/create-banner.dto";
import { UpdateBannerDto } from "../../core/dto/banner/update-banner.dto";
import * as fs from "fs";
import { promisify } from "util";
import { DataTablePayloadDto } from "../../core/dto/data-table-payload.dto";
import { TitleColumnsLanguages } from "../../core/constants/title-columns.languages";
import { DescriptionColumnsLanguages } from "../../core/constants/description-columns.languages";
import { PaginationResponseDto } from "../../core/dto/pagination-response.dto";
import { UpdateSingleAttributeOfEntityDto } from "../../core/dto/update-single-attribute-of-entity.dto";
const unlinkFilePromise = promisify(fs.unlink);

@Injectable()
export class BannerService {
  private readonly logger = new Logger(BannerService.name);

  constructor(
    @InjectRepository(BannerEntity)
    private bannerEntityRepository: Repository<BannerEntity>,
  ) {}

  public async getBanners(
    query: DataTablePayloadDto,
  ): Promise<PaginationResponseDto<BannerEntity>> {
    this.logger.log("[Banner] get all");

    const findOptions = {
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    };

    if (query.filter) {
      findOptions["where"] = [
        ...TitleColumnsLanguages,
        ...DescriptionColumnsLanguages,
      ].map((column) => ({
        [column]: Like(`%${query.filter}%`),
      }));
    }

    if (query.sortBy) {
      findOptions["order"] = {
        [query.sortBy]: query.order,
      };
    }

    const [data, count] = await this.bannerEntityRepository.findAndCount(
      findOptions,
    );
    return {
      results: data,
      total: count,
    };
  }

  public async getActiveBanners(): Promise<BannerEntity[]> {
    this.logger.log("[Banner] get all actives");

    return this.bannerEntityRepository.find({
      where: {
        is_active: true,
      },
    });
  }

  public getBanner(id: number): Promise<BannerEntity> {
    return this.bannerEntityRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  public createBanner(
    body: CreateBannerDto,
    file: Express.Multer.File,
  ): Promise<BannerEntity> {
    this.logger.log("[Banner] create new", {
      body,
    });
    const banner = this.bannerEntityRepository.create({
      ...body,
      link: file.path,
    });
    return this.bannerEntityRepository.save(banner);
  }

  public async updateBanner(
    bannerId: string,
    body: UpdateBannerDto,
    file?: Express.Multer.File,
  ): Promise<BannerEntity> {
    this.logger.log("[Banner] update new by ID", {
      body,
    });

    const banner = await this.bannerEntityRepository.findOneOrFail({
      where: {
        id: Number(bannerId),
      },
    });

    if (file) {
      await unlinkFilePromise(banner.link);
    }

    return this.bannerEntityRepository.save({
      ...banner,
      ...body,
      link: file?.path || banner.link,
    });
  }

  public async deleteBanner(bannerId: string): Promise<void> {
    this.logger.log("[Banner] delete by ID", {
      bannerId,
    });
    const banner = await this.bannerEntityRepository.findOneOrFail({
      where: {
        id: Number(bannerId),
      },
    });

    return this.bannerEntityRepository.remove(banner).then(() => null);
  }

  public async updateAttribute(
    bannerId: number,
    body: UpdateSingleAttributeOfEntityDto<BannerEntity, boolean>,
  ): Promise<void> {
    this.logger.log("[Banner] change active state", {
      bannerId,
      body,
    });

    await this.bannerEntityRepository.update(
      {
        id: bannerId,
      },
      {
        [body.property]: body.value,
      },
    );
  }
}
