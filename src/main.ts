import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { EntityNotFoundExceptionFilter } from "./core/filters/entity-not-found-exception.filter";

const swaggerSetup = (app: any, version: string): void => {
  const config = new DocumentBuilder()
    .addServer(process.env.BASE_PATH)
    .setTitle("Galad")
    .setDescription("API documentation of galad.am")
    .setVersion(version)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new EntityNotFoundExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  swaggerSetup(app, "1.0");
  await app.listen(3000);
}
bootstrap();
