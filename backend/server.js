import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import filesRoutes from './routes/filesRoutes.js';
import projectRoutes from './routes/projectRoutes.js';

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

// Security headers
app.use(helmet());

// CORS - Allow requests from frontend
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://puspenderrrr.netlify.app',
      'https://puspender.in'
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parser - with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    const startTime = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    });
    next();
  });
}

// Request timeout middleware - prevent hanging requests
app.use((req, res, next) => {
  // Set timeout for all requests (30 seconds)
  req.setTimeout(30000);
  res.setTimeout(30000, () => {
    console.error('Response timeout for:', req.method, req.path);
    if (!res.headersSent) {
      res.status(503).json({
        success: false,
        message: 'Request timeout - server took too long to respond'
      });
    }
  });
  next();
});

// ============================================
// Routes
// ============================================

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/files', filesRoutes);
app.use('/api/projects', projectRoutes);

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// ============================================
// Error Handler (MUST be last middleware)
// ============================================
app.use(errorHandler);

// ============================================
// Server Startup
// ============================================
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Code Library Backend Server         ║
║   http://localhost:${PORT}            ║
║   Environment: ${process.env.NODE_ENV || 'development'}      ║
╚════════════════════════════════════════╝
  `);
});

// ============================================
// Timeout configurations
// ============================================
server.timeout = 30000;          // 30 second timeout
server.keepAliveTimeout = 65000;  // Keep-alive timeout

// ============================================
// Graceful Shutdown
// ============================================
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

export default app;
