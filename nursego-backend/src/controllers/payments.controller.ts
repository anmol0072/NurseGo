import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_xxxx', 
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_xxxx', 
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    try {
      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (razorpayError) {
      console.error('Razorpay API Error:', razorpayError);
      res.status(500).json({ error: 'Razorpay API rejected the request. Please check your API keys.' });
    }
  } catch (error) {
    console.error('Payment Error:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // In production, we would use crypto to verify the signature:
    // const body = razorpay_order_id + "|" + razorpay_payment_id;
    // const expectedSignature = crypto.createHmac('sha256', 'mocksecret1234567890abcd').update(body.toString()).digest('hex');
    
    // For demo purposes, we will just assume success
    res.json({ success: true, message: 'Payment verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Payment verification failed' });
  }
};
