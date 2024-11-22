import { NextFunction, Request, Response, Router } from 'express';
import userFeedService from '@services/userFeed.service';
import { RequestCreateFeed , RequestUpdateFeed } from '@dtos/feed.dto';
import { authMiddleware } from '@middlewares/auth.middleware';

class UserFeedRoute {
  public router = Router();

  constructor() {
    this.createRoutes();
  }

  createRoutes(): void {
    this.router.get('/user_feed/:article_id', authMiddleware, this.getUserFeed.bind(this));
    this.router.get('/user_feed/', authMiddleware, this.getUserFeedPending.bind(this));
  }

  private getUserFeed(req: Request, res: Response, next: NextFunction) {
    const {
      params: { article_id },
    } = req

    if (!article_id) {
      return res.status(400).json({ error: "El id del artículo es obligatorio" });
    } 
    userFeedService
      .getUserFeedByArticle(article_id)
      .then((response) => res.json(response))
      .catch((err) => next(err));
  }
  

  private getUserFeedPending(req: Request, res: Response, next: NextFunction) {
    console.log(req.user);
    const user_id = req.user.id;

    userFeedService
      .getUserFeedByUserIdPending(user_id)
      .then((response) => res.json(response))
      .catch((err) => next(err));
  }

  
    
}

export default new UserFeedRoute().router;