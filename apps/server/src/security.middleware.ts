import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export function applySecurity(app: any) {
  app.use(helmet());
  app.enableCors({ origin: process.env.ADMIN_ORIGIN || '*', methods: ['GET','POST','PUT','DELETE'] });
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: 200,
    })
  );
}


