import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SeoEntity } from "../../entities/seo.entity";
import { Repository } from "typeorm";
import { SeoPages } from "../../models/enums/seo-pages";
import { SaveSeoDto } from "../../core/dto/seo/save-seo.dto";
import { promisify } from "util";
import * as fs from "fs";
const unlinkPromise = promisify(fs.unlink);
@Injectable()
export class SeoService {
  private readonly logger = new Logger(SeoService.name);

  constructor(
    @InjectRepository(SeoEntity)
    private seoEntityRepository: Repository<SeoEntity>,
  ) {}

  public getPage(page: SeoPages): Promise<SeoEntity> {
    this.logger.log("[Seo] get page", {
      page,
    });
    return this.seoEntityRepository.findOneOrFail({
      where: {
        page,
      },
    });
  }

  public async savePageSeoData(
    page: SeoPages,
    body: SaveSeoDto,
    file?: Express.Multer.File,
  ): Promise<SeoEntity> {
    this.logger.log("[Seo] save data", {
      page,
      body,
      file,
    });
    let seo = await this.seoEntityRepository.findOne({
      where: {
        page,
      },
    });

    if (!seo) {
      seo = this.seoEntityRepository.create({
        page,
      });
    }

    if (file) {
      if (seo.image && seo.image !== file.path) {
        await unlinkPromise(seo.image);
      }
      seo.image = file.path;
    }

    return this.seoEntityRepository.save({
      ...seo,
      ...body,
    });
  }
}
