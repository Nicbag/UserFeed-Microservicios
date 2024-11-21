import { Router } from 'express';
import testRoute from './test.route';
import userFeedRoute from './userFeed.route';
import feedRoute from './feed.route';

const router = Router();

router.use(feedRoute);
router.use(userFeedRoute);

export default router;
