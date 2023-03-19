import { NameColumnsLanguages } from "../core/constants/name-columns.languages";
import { CategoryEntity } from "../entities/category.entity";

export class CategoryRepository {
  public static isCategoryValidToActivate(
    category: CategoryEntity,
  ): null | Array<{ filed: string; message: string }> {
    const invalidFields = [];

    [...NameColumnsLanguages].forEach((key) => {
      if (!category[key]?.trim()) {
        invalidFields.push({
          filed: key,
          message: `${key} is required for category activation`,
        });
      }
    });

    if (!category.link) {
      invalidFields.push({
        filed: "image",
        message: "Please upload image for category before activation",
      });
    }

    return invalidFields.length ? invalidFields : null;
  }
}
