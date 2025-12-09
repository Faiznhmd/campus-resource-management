// import * as dotenv from 'dotenv';
// dotenv.config(); // <-- LOAD .env FILE

import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors({
    origin: 'http://localhost:4000', // your Next.js frontend
    credentials: true, // allow cookies / tokens
  });

  await app.listen(5000); // backend running on port 3000
}
bootstrap();
