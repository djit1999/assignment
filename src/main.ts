import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppConfiguration } from './configuration/app.config';

import * as cookieParser from 'cookie-parser';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionsFilter } from './exceptions/app.exceptions';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const appConfig = app.get(AppConfiguration); 
 
  app.use(cookieParser())

  const corsOptions: CorsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  }
  app.enableCors(corsOptions);

  app.use(helmet({
    crossOriginEmbedderPolicy: true,
    contentSecurityPolicy: {
      directives: {
        imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
        scriptSrc: [`'self'`, `'unsafe-eval'`, `https: 'unsafe-inline'`, 'https://cdn.jsdelivr.net/npm/sweetalert2@11'],
        manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
        frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        connectSrc: ["'self'", "https://firebaseinstallations.googleapis.com","https://fcmregistrations.googleapis.com"]
      },
    },
  }));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true, 
      skipNullProperties: true,
      skipUndefinedProperties: true
    }),
  );

  
  app.useGlobalFilters(
    new HttpExceptionsFilter(appConfig)
  );

  app.listen(parseInt(appConfig.APPLICATION_PORT) || 8888, () => {
    console.log(`Application is running on: ${appConfig.APPLICATION_PORT}`);
  });

}
bootstrap();
