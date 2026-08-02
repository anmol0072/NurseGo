import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const uploadDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, type, url } = req.body;
    
    if (!userId || !type || !url) {
      res.status(400).json({ success: false, message: 'Missing required fields' });
      return;
    }

    const document = await prisma.document.create({
      data: {
        userId,
        type,
        url
      }
    });

    res.json({ success: true, message: 'Document saved successfully', data: document });
  } catch (error) {
    console.error('Error saving document:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId as string;
    
    const documents = await prisma.document.findMany({
      where: { userId }
    });

    res.json({ success: true, data: documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
