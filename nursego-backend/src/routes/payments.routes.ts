import { Router } from 'express';
import { createOrder, verifyPayment } from '../controllers/payments.controller';

const router = Router();

router.post('/create-order', createOrder as any);
router.post('/verify', verifyPayment as any);

export default router;
