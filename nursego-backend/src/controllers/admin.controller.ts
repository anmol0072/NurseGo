import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPendingNurses = async (req: Request, res: Response): Promise<void> => {
  try {
    const pendingNurses = await prisma.user.findMany({
      where: {
        role: 'NURSE',
        isVerified: false
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        incRegistrationNumber: true,
        experience: true,
        skills: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json({ success: true, data: pendingNurses });
  } catch (error) {
    console.error('Error fetching pending nurses:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const verifyNurse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const updatedNurse = await prisma.user.update({
      where: { id },
      data: { isVerified: true, backgroundVerified: true }
    });
    
    res.json({ success: true, message: 'Nurse verified successfully', data: updatedNurse });
  } catch (error) {
    console.error('Error verifying nurse:', error);
    res.status(500).json({ success: false, message: 'Failed to verify nurse' });
  }
};
