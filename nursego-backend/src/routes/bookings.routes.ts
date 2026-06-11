import { Router } from 'express';
import { createBooking, getPatientBookings, getAvailableBookings, acceptBooking, completeBooking, getBooking, cancelAssignment, updateNurseLocation, createTreatmentReport, createReview } from '../controllers/bookings.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', createBooking);
router.get('/patient', authMiddleware, getPatientBookings);
router.get('/:id', authMiddleware, getBooking);

// Nurse Routes
router.get('/available', authMiddleware, getAvailableBookings);
router.post('/:id/accept', authMiddleware, acceptBooking);
router.post('/:id/complete', authMiddleware, completeBooking);
router.post('/:id/cancel-assignment', authMiddleware, cancelAssignment);
router.post('/location', authMiddleware, updateNurseLocation);

// Reports & Reviews
router.post('/:id/report', authMiddleware, createTreatmentReport);
router.post('/:id/review', authMiddleware, createReview);

export default router;
