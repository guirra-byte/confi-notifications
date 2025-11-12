import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

// Singleton pattern to ensure only one Mongoose connection is created
let connectionPromise: Promise<typeof mongoose> | null = null;

const connectMongoose = async (): Promise<typeof mongoose> => {
  if (connectionPromise) {
    return connectionPromise;
  }

  const connectionUrl = process.env.DATABASE_URL || '';
  
  if (!connectionUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  mongoose.set('bufferCommands', true);

  connectionPromise = mongoose.connect(connectionUrl, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferCommands: true,
  }).then(() => {
    console.log('✅ Connected to MongoDB via Mongoose');
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
    
    const gracefulShutdown = async () => {
      console.log('Closing database connection...');
      await mongoose.connection.close();
      process.exit(0);
    };

    process.on('beforeExit', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);

    return mongoose;
  }).catch((err) => {
    console.error('Failed to connect to database:', err);
    connectionPromise = null;
    throw err;
  });

  return connectionPromise;
};

connectMongoose().catch((err) => {
  console.error('Error initializing Mongoose:', err);
  process.exit(1);
});

export default mongoose;
export { connectMongoose };

