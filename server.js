import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

let prisma;
if (process.env.NODE_ENV === 'production') {
  const { PrismaClient } = await import('@prisma/client');
  prisma = new PrismaClient();
} else {
  prisma = await import('./src/lib/mockDataService.ts').then(module => module.default);
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

app.post('/api/send-status-update', async (req, res) => {
  const { to, claimNumber, newStatus } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: to,
      subject: `Warranty Claim Status Update - ${claimNumber}`,
      text: `Your warranty claim (${claimNumber}) status has been updated to: ${newStatus}`,
      html: `<p>Your warranty claim (${claimNumber}) status has been updated to: <strong>${newStatus}</strong></p>`
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Handle all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});