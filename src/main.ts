import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.setGlobalPrefix("api");

    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: "1",
    });

    app.use(cookieParser());

    app.enableCors({
        origin: "http://localhost:3000", // This would be changed using environment variables
        credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    const config = new DocumentBuilder()
        .setTitle("Elhay Backend")
        .setDescription(
            "This API would house all core operations of the elhay application",
        )
        .setVersion("1.0")
        .addTag("") // will add something here
        .addBearerAuth(
            { type: "http", scheme: "bearer", bearerFormat: "JWT" },
            "access-token",
        )
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document, {
        customCssUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css",
        customJs: [
            "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js",
            "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js",
        ],
    });

    await app.listen(3001);
}
bootstrap();
