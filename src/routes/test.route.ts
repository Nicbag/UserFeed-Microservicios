import { NextFunction, Request, Response, Router } from 'express';
import testService from '@services/test.service';
import { authMiddleware } from '@middlewares/auth.middleware';

class TestRoute {
  public router = Router();

  constructor() {
    this.createRoutes();
  }

  createRoutes(): void {
    this.router.get('/test', this.handleTest.bind(this));
  }

  private handleTest(req: Request, res: Response, next: NextFunction) {
    testService
      .testEndpoint()
      .then((response) => res.json(response))
      .catch((err) => next(err));
  }
}

export default new TestRoute().router;
