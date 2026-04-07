import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ValidationExceptionFilter } from './filters/validation-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );

  app.useGlobalFilters(new ValidationExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Loan applications API')
    .setDescription('Dummy API for loan applications')
    .setVersion('1.0.0')
    .addTag('Applications')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css',
    customJs: [
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js',
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js',
    ],
  });

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
  console.log(`Listening on http://localhost:${port}`);
  console.log(`OpenAPI JSON: http://localhost:${port}/swagger-json`);
  console.log(`Swagger UI: http://localhost:${port}/swagger`);
}

bootstrap();
