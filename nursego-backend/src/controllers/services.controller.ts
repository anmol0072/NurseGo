import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const services = await prisma.service.findMany();
    res.json({ success: true, data: services });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, basePrice } = req.body;
    
    const newService = await prisma.service.create({
      data: {
        name,
        basePrice: parseFloat(basePrice) || 0,
      }
    });
    
    res.json({ success: true, message: 'Service added successfully', data: newService });
  } catch (error) {
    console.error('Error adding service:', error);
    res.status(500).json({ success: false, message: 'Failed to add service' });
  }
};

export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.service.delete({ where: { id } });
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ success: false, message: 'Failed to delete service' });
  }
};
