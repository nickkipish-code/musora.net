import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { initSentry } from './sentry.service';
import * as express from 'express';
import { RolesGuard } from './roles.guard';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  initSentry();
  const app = await NestFactory.create(AppModule);
  // register global validation pipe and RolesGuard for RBAC
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // RolesGuard is applied globally via provider in AuthModule; ensure Reflector is available
  const { applySecurity } = await import('./security.middleware');
  applySecurity(app);
  // attach JWT middleware so that express requests have user attached for RolesGuard
  const server = app.getHttpAdapter().getInstance() as express.Express;
  const { jwtMiddleware } = await import('./jwt.middleware');
  server.use(jwtMiddleware);

  const config = new DocumentBuilder()
    .setTitle('Museum Delivery API')
    .setDescription('API for Museum Delivery')
    .setVersion('0.1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.API_PORT || 4000);
}

bootstrap();


