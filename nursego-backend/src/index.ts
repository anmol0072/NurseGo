import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import path from 'path';

// Trigger Render Deployment 2
import authRoutes from './routes/auth.routes';
import paymentsRoutes from './routes/payments.routes';
import bookingsRoutes from './routes/bookings.routes';
import uploadRoutes from './routes/upload.routes';
import settingsRoutes from './routes/settings.routes';
import servicesRoutes from './routes/services.routes';
import documentsRoutes from './routes/documents.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/documents', documentsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'NurseGo API is running smoothly' });
});

// Data Deletion Request Form
app.get('/delete-account', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>NurseGo - Account Deletion</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; color: #111827; display: flex; justify-content: center; padding: 2rem; }
        .container { background-color: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 500px; width: 100%; }
        h1 { color: #1d4ed8; font-size: 1.5rem; margin-bottom: 0.5rem; }
        p { color: #4b5563; margin-bottom: 1.5rem; line-height: 1.5; }
        label { display: block; font-weight: 600; margin-bottom: 0.5rem; }
        input { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; margin-bottom: 1.5rem; box-sizing: border-box; }
        button { background-color: #ef4444; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; width: 100%; }
        button:hover { background-color: #dc2626; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Account & Data Deletion Request</h1>
        <p>Use this form to request the complete deletion of your NurseGo account and all associated medical data.</p>
        <form method="POST" action="/delete-account">
          <label for="identifier">Registered Email or Phone Number</label>
          <input type="text" id="identifier" name="identifier" required placeholder="Enter your email or phone">
          <button type="submit">Request Permanent Deletion</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

app.use(express.urlencoded({ extended: true }));
app.post('/delete-account', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>NurseGo - Request Received</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; display: flex; justify-content: center; padding: 2rem; }
        .container { background-color: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 500px; text-align: center; }
        h1 { color: #059669; font-size: 1.5rem; margin-bottom: 1rem; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Request Received</h1>
        <p>Your account deletion request has been submitted. Our team will verify and completely purge your data within 7 business days.</p>
      </div>
    </body>
    </html>
  `);
});

import https from 'https';

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // Keep-Alive mechanism to prevent Render from sleeping and wiping SQLite DB
  const RENDER_EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL;
  if (RENDER_EXTERNAL_URL) {
    console.log(`Started Keep-Alive ping for ${RENDER_EXTERNAL_URL} every 10 minutes`);
    setInterval(() => {
      https.get(`${RENDER_EXTERNAL_URL}/health`, (res) => {
        console.log(`[Keep-Alive] Ping successful - Status: ${res.statusCode}`);
      }).on('error', (err) => {
        console.error('[Keep-Alive] Ping failed:', err.message);
      });
    }, 10 * 60 * 1000); // 10 minutes
  }
});
