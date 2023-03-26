import { SpecialSectionEntity } from "../entities/special-section.entity";
import { TitleColumnsLanguages } from "../core/constants/title-columns.languages";

export class SpecialSectionRepository {
  public static isSpecialSectionValidToActivate(
    section: SpecialSectionEntity,
  ): null | Array<{ filed: string; message: string }> {
    const invalidFields = [];

    [...TitleColumnsLanguages].forEach((key) => {
      if (!section[key]?.trim()) {
        invalidFields.push({
          filed: key,
          message: `${key} is required for section activation`,
        });
      }
    });

    if (section.products.length < 4) {
      invalidFields.push({
        filed: "products",
        message: "Section should contain at lease 4 products",
      });
    }

    return invalidFields.length ? invalidFields : null;
  }
}
