import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { EntityNotFoundExceptionFilter } from "./core/filters/entity-not-found-exception.filter";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as bodyParser from "body-parser";

const swaggerSetup = (app: any, version: string): void => {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .addServer("http://localhost:3000")
    .addServer("https://data.galad.am")
    .addServer("https://api.galad.am")
    .setTitle("Galad")
    .setDescription("API documentation of galad.am")
    .setVersion(version)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

  app.enableCors();
  app.useStaticAssets(join(__dirname, "..", "public"));
  app.useGlobalFilters(new EntityNotFoundExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  swaggerSetup(app, "1.0");
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
