import mongoose from 'mongoose';
import { logger } from '../middleware/logger.js';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    logger.info('MongoDB connected successfully', { database: mongoose.connection.name });

  } catch (error) {
    logger.error('MongoDB connection failed', { error: error.message });
    process.exit(1);
  }
};

export default connectDB;
