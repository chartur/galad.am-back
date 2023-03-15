import { Test, TestingModule } from "@nestjs/testing";
import { GTranslatorService } from "./g-translator.service";

describe("GTranslatorService", () => {
  let service: GTranslatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GTranslatorService],
    }).compile();

    service = module.get<GTranslatorService>(GTranslatorService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
