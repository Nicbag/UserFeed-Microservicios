import { NextFunction, Request, Response, Router } from 'express';
import priceService from '@services/price.service';
import { RequestCreateFeed , RequestUpdateFeed } from '@dtos/feed.dto';
import { authMiddleware } from '@middlewares/auth.middleware';

class PriceRoute {
  public router = Router();

  constructor() {
    this.createRoutes();
  }

  createRoutes(): void {
    this.router.post('/prices', authMiddleware, this.createUpdateFeed.bind(this));
    // this.router.get('/prices/:article_id', authMiddleware, this.getPrice.bind(this));
  }

  private createUpdateFeed(req: Request, res: Response, next: NextFunction) {
    const { body } = req as RequestCreateFeed;
    priceService
      .createUpdatePrice(body)
      .then((response) => res.json(response))
      .catch((err) => next(err));
  }
/*
  private getPrice(req: Request, res: Response, next: NextFunction) {
    const {
      params: { article_id },
    } = req as RequestGetDeletePrice;
    priceService
      .getPriceByProduct(article_id)
      .then((response) => res.json(response))
      .catch((err) => next(err));
  }
      */
}

export default new PriceRoute().router;
