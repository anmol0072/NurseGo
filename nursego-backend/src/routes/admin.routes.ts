import { Router } from 'express';
import { getPendingNurses, verifyNurse } from '../controllers/admin.controller';

const router = Router();

// Ideally, these routes should be protected by an adminAuthMiddleware.
// For now, they are open or protected by whatever frontend mechanism exists.
router.get('/nurses/pending', getPendingNurses);
router.put('/nurses/:id/verify', verifyNurse);

export default router;
