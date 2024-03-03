import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionsFilter } from './http-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.use(cookieParser());
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  app.useGlobalFilters(new HttpExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('ShopLoyality')
    .setDescription('ShopLoyality API description')
    .setVersion('0.0.1')
    .setLicense(
      'MIT',
      'https://github.com/KostaD02/ShopLoyalty/blob/main/LICENSE',
    )
    .setContact(
      'Konstantine Datunishvli',
      '',
      'info@konstantinedatunishvili.com',
    )
    .setExternalDoc('Personal website', 'https://konstantinedatunishvili.com')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
