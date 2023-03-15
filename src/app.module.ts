import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { ENTITIES } from "./entities";
import { BannerModule } from "./routes/banner/banner.module";
import { MulterModule } from "@nestjs/platform-express";
import { AuthModule } from "./routes/admin/auth/auth.module";
import { TranslatorModule } from "./routes/translator/translator.module";
import { GTranslatorModule } from "./shared/modules/g-translator/g-translator.module";
import { ProductModule } from "./routes/product/product.module";

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
    }),
    MulterModule.register({
      dest: "./upload",
    }),
    BannerModule,
    AuthModule,
    TranslatorModule,
    ProductModule,
  ],
  providers: [],
})
export class AppModule {}
