import { Router } from 'express';
import { uploadDocument, getDocuments } from '../controllers/documents.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', uploadDocument);
router.get('/:userId', getDocuments);

export default router;
