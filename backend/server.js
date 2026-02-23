import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import filesRoutes from './routes/filesRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import heroSlidesRoutes from './routes/heroSlidesRoutes.js'; // <-- NEW

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// Database Connection
// ============================================
connectDB();

// ============================================
// Middleware
// ============================================

// Security
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ============================================
// Health Check
// ============================================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ============================================
// API Routes
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/files', filesRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/hero-slides', heroSlidesRoutes); // <-- THIS FIXES YOUR ISSUE

// ============================================
// 404 Handler
// ============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// ============================================
// Global Error Handler (Must be last)
// ============================================
app.use(errorHandler);

// ============================================
// Start Server
// ============================================
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Portfolio Backend Server             ║
║   http://localhost:${PORT}             ║
║   Environment: ${process.env.NODE_ENV || 'development'}      
╚════════════════════════════════════════╝
  `);
});

// Timeout Config
server.timeout = 30000;
server.keepAliveTimeout = 65000;

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

export default app;