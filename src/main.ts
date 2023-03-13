import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { EntityNotFoundExceptionFilter } from "./core/filters/entity-not-found-exception.filter";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";

const swaggerSetup = (app: any, version: string): void => {
  const config = new DocumentBuilder()
    .addServer("http://localhost:3000")
    .addServer("https://data.galad.am")
    .setTitle("Galad")
    .setDescription("API documentation of galad.am")
    .setVersion(version)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.useStaticAssets(join(__dirname, "..", "public"));
  app.useGlobalFilters(new EntityNotFoundExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  swaggerSetup(app, "1.0");
  await app.listen(3000);
}
bootstrap();
