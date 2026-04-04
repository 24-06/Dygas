import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { IncomingMessage, ServerResponse } from 'http';

const expressApp = express();
let isInitialized = false;

const bootstrap = async () => {
  if (isInitialized) return;

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    { logger: false },
  );

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.init();
  isInitialized = true;
};

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await bootstrap();
  expressApp(req as any, res as any);
}
