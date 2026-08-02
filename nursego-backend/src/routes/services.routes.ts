import { Router } from 'express';
import { getServices, addService, deleteService } from '../controllers/services.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getServices);
router.post('/', addService); // Ideally protected by admin auth middleware
router.delete('/:id', deleteService); // Ideally protected by admin auth middleware

export default router;
