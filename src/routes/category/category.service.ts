import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { DataTablePayloadDto } from "../../core/dto/data-table-payload.dto";
import { PaginationResponseDto } from "../../core/dto/pagination-response.dto";
import { NameColumnsLanguages } from "../../core/constants/name-columns.languages";
import { DescriptionColumnsLanguages } from "../../core/constants/description-columns.languages";
import { ILike, Not, Repository } from "typeorm";
import { CategoryStatus } from "../../models/enums/category-status";
import {
  CategoryEntity,
  CategoryWithProductsCount,
} from "../../entities/category.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateCategoryDto } from "../../core/dto/category/create-category.dto";
import { UpdateCategoryDto } from "../../core/dto/category/update-category.dto";
import { promisify } from "util";
import { CategoryRepository } from "../../repositories/category.repository";
import * as fs from "fs";
import { ProductStatus } from "../../models/enums/product-status";
import { ProductEntity } from "../../entities/product.entity";

const unlinkFilePromise = promisify(fs.unlink);

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @InjectRepository(CategoryEntity)
    private categoryEntityRepository: Repository<CategoryEntity>,
    @InjectRepository(ProductEntity)
    private productEntityRepository: Repository<ProductEntity>,
  ) {}

  public async getCategoriesByStatus(
    status: CategoryStatus,
    query: DataTablePayloadDto,
  ): Promise<PaginationResponseDto<CategoryEntity>> {
    this.logger.log("[Category] get all by search result and status", {
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
      findOptions["where"] = [
        ...NameColumnsLanguages,
        ...DescriptionColumnsLanguages,
      ].map((column) => ({
        ...whereCondition,
        [column]: ILike(`%${query.filter.trim()}%`),
      }));
    }

    if (query.sortBy) {
      findOptions["order"] = {
        [query.sortBy]: query.order,
      };
    }

    const [data, count] = await this.categoryEntityRepository.findAndCount({
      ...findOptions,
    });

    return {
      results: data,
      total: count,
    };
  }

  public async getAllActiveCategories(): Promise<CategoryWithProductsCount[]> {
    this.logger.log("[Category] get all actives");

    return await this.categoryEntityRepository
      .createQueryBuilder("categories")
      .select("categories.*")
      .where("categories.status = :status", { status: CategoryStatus.Active })
      .leftJoin("categories.products", "products")
      .addSelect("COUNT(DISTINCT(products.id)) as products_count")
      .groupBy("categories.id")
      .execute();
  }

  public createCategory(
    body: CreateCategoryDto,
    file: Express.Multer.File,
  ): Promise<CategoryEntity> {
    this.logger.log("[Category] create new", {
      body,
    });
    const banner = this.categoryEntityRepository.create({
      ...body,
      link: file.path,
    });
    return this.categoryEntityRepository.save(banner);
  }

  public getCategoryById(categoryId: number): Promise<CategoryEntity> {
    this.logger.log("[Category] get by ID", {
      id: categoryId,
    });

    return this.categoryEntityRepository.findOneOrFail({
      where: {
        id: categoryId,
      },
    });
  }

  public async updateCategoryById(
    categoryId: number,
    body: UpdateCategoryDto,
    file?: Express.Multer.File,
  ): Promise<CategoryEntity> {
    this.logger.log("[Category] update new by ID", {
      id: categoryId,
      body,
      file,
    });

    const category = await this.categoryEntityRepository.findOneOrFail({
      where: {
        id: categoryId,
      },
    });

    if (file && category.link) {
      await unlinkFilePromise(category.link);
    }

    return this.categoryEntityRepository.save({
      ...category,
      ...body,
      link: file?.path || category.link,
    });
  }

  public async activateCategory(id: number): Promise<CategoryEntity> {
    this.logger.log("[Category] activation", {
      id,
    });

    const category = await this.categoryEntityRepository.findOneOrFail({
      where: {
        id,
        status: Not(CategoryStatus.Active),
      },
    });

    const activationValidation =
      CategoryRepository.isCategoryValidToActivate(category);

    if (activationValidation) {
      throw new BadRequestException(activationValidation);
    }

    category.status = CategoryStatus.Active;

    await this.categoryEntityRepository.save(category);
    return this.categoryEntityRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  public async disableCategory(id: number): Promise<CategoryEntity> {
    this.logger.log("[Category] disable", {
      id,
    });

    const category = await this.categoryEntityRepository.findOneOrFail({
      where: {
        id,
        status: CategoryStatus.Active,
      },
      relations: ["products"],
    });

    category.status = CategoryStatus.Inactive;
    category.products = category.products?.map((product) => ({
      ...product,
      status: ProductStatus.Inactive,
    }));

    await this.categoryEntityRepository.save(category);
    await this.productEntityRepository.save(category.products);
    return this.categoryEntityRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }
}
