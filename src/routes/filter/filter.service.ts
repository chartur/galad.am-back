import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "../../entities/product.entity";
import { Brackets, Repository } from "typeorm";
import { FilterRequestDto } from "../../core/dto/filter/filter.request.dto";
import { CategoryStatus } from "../../models/enums/category-status";
import { ProductStatus } from "../../models/enums/product-status";
import { NameColumnsLanguages } from "../../core/constants/name-columns.languages";
import { DescriptionColumnsLanguages } from "../../core/constants/description-columns.languages";

@Injectable()
export class FilterService {
  private readonly logger = new Logger(FilterService.name);

  constructor(
    @InjectRepository(ProductEntity)
    private productEntityRepository: Repository<ProductEntity>,
  ) {}

  public async filter(body: FilterRequestDto): Promise<ProductEntity[]> {
    let query = this.productEntityRepository
      .createQueryBuilder("products")
      .leftJoinAndSelect("products.category", "category")
      .leftJoinAndSelect("products.assets", "assets")
      .leftJoinAndSelect("products.tags", "tags")
      .andWhere("products.status = :productStatus", {
        productStatus: ProductStatus.Active,
      })
      .andWhere("category.status = :categoryStatus", {
        categoryStatus: CategoryStatus.Active,
      });

    if (body.sale) {
      query = query.andWhere("products.new_price > 0");
    }

    if (body?.category?.length > 0) {
      query = query.andWhere("category.id IN (:...categoryId)", {
        categoryId: body.category,
      });
    }

    if (body?.tags?.length > 0) {
      query = query.andWhere("tags.id IN (:...tagIds)", {
        tagIds: body.tags,
      });
    }

    if (body.minPrice) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where("products.price >= :minPrice", {
            minPrice: body.minPrice,
          }).orWhere("products.new_price >= :minPrice", {
            minPrice: body.minPrice,
          });
        }),
      );
    }

    if (body.maxPrice) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where("products.price <= :maxPrice", {
            minPrice: body.minPrice,
          }).orWhere("products.new_price <= :maxPrice", {
            maxPrice: body.maxPrice,
          });
        }),
      );
    }

    if (body.q) {
      query.andWhere(
        new Brackets((qb) => {
          [...NameColumnsLanguages, ...DescriptionColumnsLanguages].forEach(
            (column) => {
              qb.orWhere(`products.${column} ILike :q`, {
                q: `%${body.q.trim()}%`,
              });
            },
          );
        }),
      );
    }

    return await query.getMany();
  }
}
