import { Test, TestingModule } from "@nestjs/testing";
import { SpecialSectionService } from "./special-section.service";

describe("SpecialSectionService", () => {
  let service: SpecialSectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpecialSectionService],
    }).compile();

    service = module.get<SpecialSectionService>(SpecialSectionService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
