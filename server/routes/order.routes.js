import { Router } from 'express';
import { createOrder, getOrder } from '../controllers/order.controller.js';

const router = Router();

router.post('/orders', createOrder);
router.get('/orders/:id', getOrder);

export default router;
