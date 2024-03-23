import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { ENTITIES } from "./entities";
import { BannerModule } from "./routes/banner/banner.module";
import { MulterModule } from "@nestjs/platform-express";
import { AuthModule as AdminAuthModule } from "./routes/admin/auth/auth.module";
import { TranslatorModule } from "./routes/translator/translator.module";
import { ProductModule } from "./routes/product/product.module";
import { CategoryModule } from "./routes/category/category.module";
import { AppController } from "./app.controller";
import { SpecialSectionModule } from "./routes/special-section/special-section.module";
import { TagModule } from "./routes/tag/tag.module";
import { AuthModule as UserAuthModule } from "./routes/user/auth/auth.module";
import { ProfileModule } from "./routes/profile/profile.module";
import { FilterModule } from './routes/filter/filter.module';
import { OrderModule } from './routes/order/order.module';
import { SeoModule } from './routes/seo/seo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.mode || "local"}.env`,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
      entities: ENTITIES,
      // logging: true,
    }),
    MulterModule.register({
      dest: "./upload",
    }),
    BannerModule,
    AdminAuthModule,
    UserAuthModule,
    TranslatorModule,
    ProductModule,
    CategoryModule,
    SpecialSectionModule,
    TagModule,
    ProfileModule,
    FilterModule,
    OrderModule,
    SeoModule,
  ],
  providers: [],
  controllers: [AppController],
})
export class AppModule {}
