import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "../../entities/product.entity";
import { Like, Repository } from "typeorm";
import { SaveProductContentDto } from "../../core/dto/product/save-product-content.dto";
import { ProductStatus } from "../../models/enums/product-status";
import { DataTablePayloadDto } from "../../core/dto/data-table-payload.dto";
import { PaginationResponseDto } from "../../core/dto/pagination-response.dto";
import { DescriptionColumnsLanguages } from "../../core/constants/description-columns.languages";
import { NameColumnsLanguages } from "../../core/constants/name-columns.languages";
import { SaveProductValuesDto } from "../../core/dto/product/save-product-values.dto";

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(ProductEntity)
    private productEntityRepository: Repository<ProductEntity>,
  ) {}

  public async getProductsByStatus(
    status: ProductStatus,
    query: DataTablePayloadDto,
  ): Promise<PaginationResponseDto<ProductEntity>> {
    this.logger.log("[Product] get all by search result and status", {
      status,
      query,
    });

    const whereCondition: any = {
      status: status,
    };

    const findOptions = {
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      where: whereCondition,
    };

    if (query.filter) {
      findOptions["where"] = [
        ...NameColumnsLanguages,
        ...DescriptionColumnsLanguages,
      ].map((column) => ({
        ...whereCondition,
        [column]: Like(`%${query.filter}%`),
      }));
    }

    if (query.sortBy) {
      findOptions["order"] = {
        [query.sortBy]: query.order,
      };
    }

    const [data, count] = await this.productEntityRepository.findAndCount(
      findOptions,
    );
    return {
      results: data,
      total: count,
    };
  }

  public getProductById(id: number): Promise<ProductEntity> {
    this.logger.log("[Product] get by id", {
      id,
    });

    return this.productEntityRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  public async saveProductContentData(
    id: undefined | number,
    body: SaveProductContentDto,
  ) {
    this.logger.log("[Product] save content", {
      id,
      body,
    });

    let product: ProductEntity;
    if (id) {
      product = await this.productEntityRepository.findOneOrFail({
        where: {
          id,
        },
      });
    } else {
      product = this.productEntityRepository.create();
    }

    product = {
      ...product,
      ...body,
    };

    return this.productEntityRepository.save(product);
  }

  public async saveProductValuesData(
    id: number,
    body: SaveProductValuesDto,
  ): Promise<ProductEntity> {
    this.logger.log("[Product] save values", {
      id,
      body,
    });

    const product = await this.productEntityRepository.findOneOrFail({
      where: {
        id,
      },
    });

    return this.productEntityRepository.save({
      ...product,
      ...body,
    });
  }
}
