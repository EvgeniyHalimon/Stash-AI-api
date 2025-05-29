import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class NormalizeUrlMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.url) {
      const [path, query] = req.url.split('?');
      req.url = path.replace(/\/{2,}/g, '/');
      if (query) {
        req.url += '?' + query;
      }
    }
    next();
  }
}
