import { Router } from 'express';
import { createBooking, getPatientBookings } from '../controllers/bookings.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', createBooking);
router.get('/patient', authMiddleware, getPatientBookings);

export default router;
