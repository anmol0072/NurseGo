import { Router } from 'express';
import { changePassword, toggle2FA } from '../controllers/settings.controller';

const router = Router();

// Change Password
router.post('/change-password', changePassword);

// Toggle Two-Factor Authentication
router.post('/toggle-2fa', toggle2FA);

export default router;
