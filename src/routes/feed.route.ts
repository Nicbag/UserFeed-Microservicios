import { NextFunction, Request, Response, Router } from 'express';
import feedService from '@services/feed.service';
import { RequestCreateFeed } from '@dtos/feed.dto';
import { authMiddleware } from '@middlewares/auth.middleware';

class FeedRoute {
  public router = Router();

  constructor() {
    this.createRoutes();
  }

  createRoutes(): void {
    this.router.get('/feed/:article_id',authMiddleware, this.getFeed.bind(this));
  }

  private getFeed(req: Request, res: Response, next: NextFunction) {
    const {
      params: { article_id },
    } = req

    if (!article_id) {
      return res.status(400).json({ error: "El id del artículo es obligatorio" });
    }
    feedService
      .getFeedByArticle(article_id)
      .then((response) => res.json(response))
      .catch((err) => next(err));
  }

  
    
}

export default new FeedRoute().router;
