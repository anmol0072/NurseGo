import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    if (!userId || !oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.password) {
      return res.status(400).json({ success: false, message: 'No password set for this account. You may be logged in via Google.' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect old password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const toggle2FA = async (req: Request, res: Response) => {
  try {
    const { userId, enabled } = req.body;

    if (!userId || enabled === undefined) {
      return res.status(400).json({ success: false, message: 'User ID and enabled status are required' });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: enabled },
    });

    res.json({ success: true, message: `Two-Factor Authentication ${enabled ? 'enabled' : 'disabled'}`, twoFactorEnabled: user.twoFactorEnabled });
  } catch (error) {
    console.error('Toggle 2FA Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
