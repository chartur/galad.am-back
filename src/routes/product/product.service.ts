import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "../../entities/product.entity";
import { Like, Not, Repository } from "typeorm";
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

    const [data, count] = await this.productEntityRepository.findAndCount({
      ...findOptions,
      relations: ["assets", "category"],
    });

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
      relations: ["category", "assets"],
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
    console.log(id);
    console.log(typeof id);
    if (id) {
      console.log("GEXEC");
      product = await this.productEntityRepository.findOneOrFail({
        where: {
          id: Number(id),
        },
        relations: ["assets", "category"],
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
      relations: ["assets", "category"],
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
      relations: ["assets", "category"],
    });

    product.category = {
      id: body.category,
    } as CategoryEntity;

    await this.productEntityRepository.save(product);
    return this.productEntityRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ["assets", "category"],
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
      relations: ["assets", "category"],
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
      relations: ["assets", "category"],
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
      relations: ["assets", "category"],
    });

    product.status = ProductStatus.Deleted;

    await this.productEntityRepository.save(product);
    return this.productEntityRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ["assets", "category"],
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
}
