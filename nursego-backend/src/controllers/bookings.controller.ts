import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId, serviceName, totalAmount, distance, paymentMethod } = req.body;

    if (!patientId || !serviceName || !totalAmount) {
      res.status(400).json({ success: false, message: 'Missing required fields' });
      return;
    }

    // Find service by name to link it
    const service = await prisma.service.findFirst({
      where: { name: serviceName }
    });

    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found in DB' });
      return;
    }

    const newBooking = await prisma.booking.create({
      data: {
        patientId,
        serviceId: service.id,
        totalAmount,
        distance: distance || 4,
        paymentMethod: paymentMethod || 'UPI',
        status: 'PENDING',
        paymentStatus: 'SUCCESS'
      }
    });

    res.json({ success: true, booking: newBooking });
  } catch (error) {
    console.error('Create Booking Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getPatientBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const userId = req.user?.userId;
    
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const bookings = await prisma.booking.findMany({
      where: { patientId: userId },
      include: {
        service: true,
        nurse: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Fetch Bookings Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
