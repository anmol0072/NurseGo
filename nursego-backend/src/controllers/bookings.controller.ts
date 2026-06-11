import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId, serviceName, totalAmount, distance, paymentMethod, prescriptionUrl } = req.body;

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
        prescriptionUrl: prescriptionUrl || null,
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

export const getAvailableBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { status: 'PENDING' },
      include: {
        service: true,
        patient: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Fetch Available Bookings Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const acceptBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    // @ts-ignore
    const nurseId = req.user?.userId;

    if (!nurseId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        nurseId,
        status: 'ACCEPTED'
      }
    });

    res.json({ success: true, booking });
  } catch (error) {
    console.error('Accept Booking Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const completeBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status: 'COMPLETED'
      }
    });

    res.json({ success: true, booking });
  } catch (error) {
    console.error('Complete Booking Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        service: true,
        nurse: true,
        patient: true,
        treatmentReport: true,
        review: true
      }
    });

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }
    res.json({ success: true, booking });
  } catch (error) {
    console.error('Get Booking Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const cancelAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Reset the booking to PENDING and remove the nurse
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status: 'PENDING',
        nurseId: null
      }
    });

    res.json({ success: true, booking });
  } catch (error) {
    console.error('Cancel Assignment Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateNurseLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const nurseId = req.user?.userId;
    const { lat, lng } = req.body;

    if (!nurseId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: nurseId },
      data: { currentLat: lat, currentLng: lng }
    });

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Update Nurse Location Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const createTreatmentReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // booking id
    const { bp, pulse, temperature, procedureDone, medicinesGiven, woundImageUrls, notes, patientSignatureUrl } = req.body;

    const report = await prisma.treatmentReport.create({
      data: {
        bookingId: id,
        bp, pulse, temperature, procedureDone, medicinesGiven, woundImageUrls, notes, patientSignatureUrl
      }
    });

    // Also mark booking as COMPLETED
    await prisma.booking.update({
      where: { id },
      data: { status: 'COMPLETED' }
    });

    res.json({ success: true, report });
  } catch (error) {
    console.error('Create Treatment Report Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId, nurseId, rating, comment } = req.body;

    const review = await prisma.review.create({
      data: { bookingId, nurseId, rating, comment }
    });

    // Recalculate average rating for the nurse
    const allReviews = await prisma.review.findMany({ where: { nurseId } });
    const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;

    await prisma.user.update({
      where: { id: nurseId },
      data: { rating: avgRating }
    });

    res.json({ success: true, review });
  } catch (error) {
    console.error('Create Review Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
