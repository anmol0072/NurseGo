import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import twilio from 'twilio';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'nursenow_super_secret_key_2026';

let twilioClient: any = null;
const getTwilioClient = () => {
  if (!twilioClient) {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return twilioClient;
};

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

    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '365d' });

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

    let whereClause = {};
    if (isEmail) {
      whereClause = { email: normalizedId };
    } else {
      whereClause = {
        OR: [
          { phone: normalizedId },
          { phone: normalizedId.startsWith('+') ? normalizedId : `+91${normalizedId}` },
          { phone: normalizedId.replace(/^\+91/, '') }
        ]
      };
    }

    const user = await prisma.user.findFirst({
      where: whereClause
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

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '365d' });

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

export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone } = req.body;
    if (!phone) {
      res.status(400).json({ success: false, message: 'Phone number is required' });
      return;
    }
    
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    const twilioClient = getTwilioClient();

    await twilioClient.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verifications
      .create({ to: formattedPhone, channel: 'sms' });

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to send OTP' });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, code, role } = req.body;
    if (!phone || !code) {
      res.status(400).json({ success: false, message: 'Phone and code are required' });
      return;
    }

    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    const twilioClient = getTwilioClient();

    const verificationCheck = await twilioClient.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verificationChecks
      .create({ to: formattedPhone, code });

    if (verificationCheck.status !== 'approved') {
      res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      return;
    }

    let user = await prisma.user.findFirst({ 
      where: { 
        OR: [
          { phone: formattedPhone },
          { phone: phone },
          { phone: phone.replace(/^\+91/, '') }
        ]
      } 
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          phone: formattedPhone,
          role: role || 'PATIENT',
          name: 'New User'
        }
      });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'nursenow_super_secret_key_2026', { expiresIn: '365d' });
    res.json({ success: true, message: 'OTP verified successfully', token, user });
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to verify OTP' });
  }
};
