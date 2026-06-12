import mongoose from 'mongoose';
import mockStore from './mockStore.js';

export const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pranidha-kindergarten';
    console.log(`Connecting to MongoDB at: ${connUri}...`);
    
    // Set a short timeout (3 seconds) so the app doesn't hang if MongoDB is offline
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
      socketTimeoutMS: 3000
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    mockStore.isMock = false;
  } catch (error) {
    console.warn('\n==================================================================');
    console.warn('WARNING: Failed to connect to MongoDB.');
    console.warn('Reason:', error.message);
    console.warn('SWITCHING TO IN-MEMORY MOCK STORE FOR DEVELOPMENT & TESTING.');
    console.warn('This ensures all features are interactive without setting up MongoDB!');
    console.warn('==================================================================\n');
    mockStore.isMock = true;
  }
};
