import { Test, TestingModule } from "@nestjs/testing";
import { SpecialSectionController } from "./special-section.controller";

describe("SpecialSectionController", () => {
  let controller: SpecialSectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecialSectionController],
    }).compile();

    controller = module.get<SpecialSectionController>(SpecialSectionController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
