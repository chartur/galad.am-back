import { ProductEntity } from "../entities/product.entity";
import { NameColumnsLanguages } from "../core/constants/name-columns.languages";
import { DescriptionColumnsLanguages } from "../core/constants/description-columns.languages";
import { ProductAssetType } from "../models/enums/product-asset-type";

export class ProductRepository {
  public static isProductValidToActivate(
    product: ProductEntity,
  ): null | Array<{ filed: string; message: string }> {
    const invalidFields = [];

    [...NameColumnsLanguages, ...DescriptionColumnsLanguages].forEach((key) => {
      if (!product[key]?.trim()) {
        invalidFields.push({
          filed: key,
          message: `"${key
            .toUpperCase()
            .replace("_", " ")}" is required for product activation`,
        });
      }
    });

    if (!product.category) {
      invalidFields.push({
        filed: "category",
        message: "Please select category for product before activation",
      });
    }

    const photos = product.assets?.filter(
      (item) => item.type === ProductAssetType.Photo,
    );

    if (photos?.length === 0) {
      invalidFields.push({
        filed: "assets",
        message:
          "Product should has at least 1 photos uploaded before activation",
      });
    }

    if (!product?.tags?.length) {
      invalidFields.push({
        filed: "tags",
        message: "Product should has at least 1 tag selected before activation",
      });
    }

    ["price", "available_count"].forEach((key) => {
      if (!product[key]) {
        invalidFields.push({
          filed: key,
          message: `"${key
            .toUpperCase()
            .replace("_", " ")}" is required for product activation`,
        });
      }
    });

    return invalidFields.length ? invalidFields : null;
  }
}
