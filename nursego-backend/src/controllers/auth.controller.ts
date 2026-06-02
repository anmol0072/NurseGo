import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'nursenow_super_secret_key_2026';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, role, password } = req.body;

    if (!password) {
      res.status(400).json({ success: false, message: 'Password is required' });
      return;
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email || undefined },
          { phone: phone || undefined }
        ]
      }
    });

    if (existingUser) {
      res.status(400).json({ success: false, message: 'User with this email or phone already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        role: role || 'PATIENT',
        password: hashedPassword,
      }
    });

    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, message: 'Registration successful', token, user: newUser });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      res.status(400).json({ success: false, message: 'Identifier and password are required' });
      return;
    }

    const isEmail = identifier.includes('@');
    const normalizedId = isEmail ? identifier.toLowerCase().trim() : identifier.trim();

    const user = await prisma.user.findFirst({
      where: isEmail ? { email: normalizedId } : { phone: normalizedId }
    });

    if (!user || !user.password) {
      res.status(401).json({ success: false, message: 'Invalid credentials or user registered via Google' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, message: 'Login successful', token, user });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { googleId, email, name, role } = req.body;

    if (!googleId || !email) {
      res.status(400).json({ success: false, message: 'Google ID and email are required' });
      return;
    }

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId },
          { email }
        ]
      }
    });

    if (!user) {
      // Create new user via Google
      user = await prisma.user.create({
        data: {
          googleId,
          email,
          name: name || 'Google User',
          role: role || 'PATIENT',
        }
      });
    } else if (!user.googleId) {
      // Link Google account to existing email user
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId }
      });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, message: 'Google login successful', token, user });
  } catch (error) {
    console.error('Google Login Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Fetch me error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
