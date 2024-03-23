import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "../../entities/product.entity";
import { ILike, In, Not, Repository } from "typeorm";
import { SaveProductContentDto } from "../../core/dto/product/save-product-content.dto";
import { ProductStatus } from "../../models/enums/product-status";
import { DataTablePayloadDto } from "../../core/dto/data-table-payload.dto";
import { PaginationResponseDto } from "../../core/dto/pagination-response.dto";
import { DescriptionColumnsLanguages } from "../../core/constants/description-columns.languages";
import { NameColumnsLanguages } from "../../core/constants/name-columns.languages";
import { SaveProductValuesDto } from "../../core/dto/product/save-product-values.dto";
import { SaveProductSettingsDto } from "../../core/dto/product/save-product-settings.dto";
import { CategoryEntity } from "../../entities/category.entity";
import { ProductRepository } from "../../repositories/product.repository";
import { CategoryStatus } from "../../models/enums/category-status";
import * as _ from "lodash";
import { GetProductsByIdsDto } from "../../core/dto/product/get-products-by-ids.dto";

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(ProductEntity)
    private productEntityRepository: Repository<ProductEntity>,
    @InjectRepository(CategoryEntity)
    private categoryEntityRepository: Repository<CategoryEntity>,
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
      status: status || Not(ProductStatus.Draft),
    };

    const findOptions = {
      skip: (query.page - 1) * query.limit,
      take: query.limit < 0 ? undefined : query.limit,
      where: whereCondition,
    };

    if (query.filter) {
      findOptions["where"] = [
        ...NameColumnsLanguages,
        ...DescriptionColumnsLanguages,
      ].map((column) => ({
        ...whereCondition,
        [column]: ILike(`%${query.filter.trim()}%`),
      }));
    }

    if (query.sortBy) {
      findOptions["order"] = _.set({}, query.sortBy, query.order);
    }

    const [data, count] = await this.productEntityRepository.findAndCount({
      ...findOptions,
      relations: ["assets", "category"],
    });

    return {
      results: data,
      total: count,
    };
  }

  public getByIds(body: GetProductsByIdsDto): Promise<ProductEntity[]> {
    return this.productEntityRepository.find({
      where: {
        id: In(body.products),
        status: ProductStatus.Active,
      },
      relations: ["category", "assets"],
    });
  }

  public getProductById(id: number): Promise<ProductEntity> {
    this.logger.log("[Product] get by id", {
      id,
    });

    return this.productEntityRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ["category", "assets", "tags"],
    });
  }

  public async getRelatedProducts(id: number): Promise<ProductEntity[]> {
    this.logger.log("[Product] get related products", {
      id,
    });

    const product = await this.productEntityRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ["tags"],
    });

    return this.productEntityRepository.find({
      where: {
        id: Not(product.id),
        status: ProductStatus.Active,
        tags: {
          id: In(product.tags.map((tag) => tag.id)),
        },
        category: {
          status: CategoryStatus.Active,
        },
      },
      order: {
        id: "DESC",
      },
      take: 8,
      relations: ["tags", "assets", "category"],
    });
  }

  public async saveProductContentData(
    id: string | null,
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
          id: Number(id),
        },
        relations: ["assets", "category", "tags"],
      });
    } else {
      product = this.productEntityRepository.create();
    }

    product = {
      ...product,
      ...body,
    };

    const productEntity = await this.productEntityRepository.save(product);
    return this.productEntityRepository.findOneOrFail({
      where: {
        id: productEntity.id,
      },
      relations: ["assets", "category", "tags"],
    });
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

    await this.productEntityRepository.save({
      ...product,
      ...body,
    });
    return this.productEntityRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ["assets", "category"],
    });
  }

  public async saveProductSettingsData(
    id: number,
    body: SaveProductSettingsDto,
  ): Promise<ProductEntity> {
    this.logger.log("[Product] save settings", {
      id,
      body,
    });

    const product = await this.productEntityRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ["assets", "category", "tags"],
    });

    product.category = {
      id: body.category,
    } as CategoryEntity;

    await this.productEntityRepository.save({
      ...product,
      tags: body.tags.map((id) => ({ id })),
      is_new_arrival: body.is_new_arrival,
    });
    return this.productEntityRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ["assets", "category", "tags"],
    });
  }

  public async activateProduct(id: number): Promise<ProductEntity> {
    this.logger.log("[Product] activation", {
      id,
    });

    const product = await this.productEntityRepository.findOneOrFail({
      where: {
        id,
        status: Not(ProductStatus.Active),
      },
      relations: ["assets", "category", "tags"],
    });

    if (product.category.status !== CategoryStatus.Active) {
      throw new BadRequestException({
        message: "Category should be activated!",
      });
    }

    const activationValidation =
      ProductRepository.isProductValidToActivate(product);

    if (activationValidation) {
      throw new BadRequestException(activationValidation);
    }

    product.status = ProductStatus.Active;

    await this.productEntityRepository.save(product);
    return this.productEntityRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ["assets", "category", "tags"],
    });
  }

  public async disableProduct(id: number): Promise<ProductEntity> {
    this.logger.log("[Product] disable", {
      id,
    });

    const product = await this.productEntityRepository.findOneOrFail({
      where: {
        id,
        status: ProductStatus.Active,
      },
      relations: ["assets", "category"],
    });

    product.status = ProductStatus.Inactive;

    await this.productEntityRepository.save(product);
    return this.productEntityRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ["assets", "category"],
    });
  }

  public async deleteProduct(id: number): Promise<ProductEntity> {
    this.logger.log("[Product] delete", {
      id,
    });

    const product = await this.productEntityRepository.findOneOrFail({
      where: {
        id,
        status: Not(ProductStatus.Deleted),
      },
      relations: ["assets", "category", "tags"],
    });

    product.status = ProductStatus.Deleted;

    await this.productEntityRepository.save(product);
    return this.productEntityRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ["assets", "category", "tags"],
    });
  }

  public async moveToDraft(id: number): Promise<ProductEntity> {
    this.logger.log("[Product] move to draft", {
      id,
    });

    const product = await this.productEntityRepository.findOneOrFail({
      where: {
        id,
        status: ProductStatus.Deleted,
      },
      relations: ["assets", "category"],
    });

    product.status = ProductStatus.Draft;

    await this.productEntityRepository.save(product);
    return this.productEntityRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ["assets", "category"],
    });
  }

  public async getNewArrivals(): Promise<CategoryEntity[]> {
    this.logger.log("[Product] get new arrivals");

    const categories = await this.categoryEntityRepository
      .createQueryBuilder("categories")
      .leftJoinAndSelect("categories.products", "products")
      .leftJoinAndSelect("products.assets", "assets")
      .leftJoinAndSelect("products.tags", "tags")
      .where("categories.status = :status", {
        status: CategoryStatus.Active,
      })
      .andWhere(
        "products.status = :status AND products.is_new_arrival = :is_new_arrival",
        {
          status: ProductStatus.Active,
          is_new_arrival: true,
        },
      )
      .getMany();

    return categories;
  }
}
