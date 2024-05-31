import { Injectable, Logger } from "@nestjs/common";
import { Repository } from "typeorm";
import { ProductAssetEntity } from "../../entities/product-asset.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "../../entities/product.entity";
import { SaveProductAssetsDto } from "../../core/dto/product/save-product-assets.dto";
import { ProductAssetType } from "../../models/enums/product-asset-type";

@Injectable()
export class ProductAssetService {
  private readonly logger = new Logger(ProductAssetService.name);

  constructor(
    @InjectRepository(ProductAssetEntity)
    private productAssetEntityRepository: Repository<ProductAssetEntity>,
    @InjectRepository(ProductEntity)
    private productEntityRepository: Repository<ProductEntity>,
  ) {}

  public async saveProductAssetsData(
    id: number,
    body: SaveProductAssetsDto,
    files: Array<Express.Multer.File>,
  ): Promise<ProductEntity> {
    this.logger.log("[Product] save assets", {
      id,
      body,
    });

    const product = await this.productEntityRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ["assets", "category"],
    });

    const oldPhotos = body.oldPhotos || [];
    const photosNeedToBeDeleted = product.assets.filter(
      (asset) =>
        asset.type === ProductAssetType.Photo &&
        !oldPhotos.some((item) => item === asset.id),
    );

    if (photosNeedToBeDeleted.length > 0) {
      await this.productAssetEntityRepository.remove(photosNeedToBeDeleted);
    }

    let assets = [];

    if (oldPhotos.length > 0) {
      const previouslyUploadedPhotos = product.assets.filter(
        (asset) =>
          asset.type === ProductAssetType.Photo && oldPhotos.includes(asset.id),
      );

      if (previouslyUploadedPhotos.length > 0) {
        assets = [...previouslyUploadedPhotos];
      }
    }

    if (files && files.length > 0) {
      const newAssetsPromise = files.map((file) =>
        this.productAssetEntityRepository.save(
          this.productAssetEntityRepository.create({
            link: file.path,
            type: ProductAssetType.Photo,
            product: product,
          }),
        ),
      );

      const newAssets = await Promise.all(newAssetsPromise);

      assets = [...assets, ...newAssets];
    }

    if (body.video) {
      let videoEntity = product.assets.find(
        (item) => item.type === ProductAssetType.Video,
      );

      if (!videoEntity) {
        videoEntity = this.productAssetEntityRepository.create({
          type: ProductAssetType.Video,
        });
      }

      videoEntity.link = body.video;
      await this.productAssetEntityRepository.save(videoEntity);

      assets.push(videoEntity);
    } else {
      const videoOldAsset = product.assets.find(
        (item) => item.type === ProductAssetType.Video,
      );
      if (videoOldAsset) {
        await this.productAssetEntityRepository.remove(videoOldAsset);
      }
    }

    product.assets = assets;

    // Set fist image as main image of product
    if (
      product.assets &&
      product.assets.length > 0 &&
      !product.assets.some(
        (asset) => asset.type === ProductAssetType.Photo && asset.is_main,
      )
    ) {
      const firstPhotoAsset = product.assets.find(
        (asset) => asset.type === ProductAssetType.Photo,
      );
      firstPhotoAsset.is_main = true;
      await this.productAssetEntityRepository.save(firstPhotoAsset);
      product.mainAsset = firstPhotoAsset.link;
    }

    return this.productEntityRepository.preload(product);
  }

  public async setMainImage(productId: number, assetId: number): Promise<void> {
    this.logger.log("[Product] set main image", {
      productId,
      assetId,
    });

    const product = await this.productEntityRepository.findOneOrFail({
      where: {
        id: productId,
      },
      relations: ["assets"],
    });

    await this.productAssetEntityRepository.update(
      { product: { id: productId } },
      { is_main: false },
    );
    const mainAsset = product.assets.find((asset) => asset.id === assetId);
    mainAsset.is_main = true;
    product.mainAsset = mainAsset.link;

    await Promise.all([
      this.productAssetEntityRepository.save(mainAsset),
      this.productEntityRepository.save(product),
    ]);
  }
}
