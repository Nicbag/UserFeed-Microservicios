import { Router } from 'express';
import testRoute from './test.route';
import priceRoute from './feed.route';

const router = Router();

router.use(testRoute);
router.use(priceRoute);

export default router;
