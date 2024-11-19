import { Router } from 'express';
import testRoute from './test.route';
import priceRoute from './price.route';
import discountsRoute from './discounts.route';
import couponsRoute from './coupons.route';

const router = Router();

router.use(testRoute);
router.use(priceRoute);
router.use(discountsRoute);
router.use(couponsRoute);

export default router;
