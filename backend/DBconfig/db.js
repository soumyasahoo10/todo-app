import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

let isConnected = false;

export const connectDB = async () => {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
        console.warn('⚠️  MONGO_URL not defined in environment. Running in offline/local storage mode.');
        return false;
    }

    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(mongoUrl, {
            serverSelectionTimeoutMS: 4000, // Do not hang for 30s if host is unreachable
        });
        isConnected = true;
        console.log(`✅ MongoDB connected successfully: ${mongoose.connection.host}`);
        return true;
    } catch (err) {
        isConnected = false;
        console.warn(`⚠️  MongoDB connection error: ${err.message}`);
        console.info('💡 Server is running with resilient local storage fallback for uninterrupted operation.');
        return false;
    }
};

export const isDbConnected = () => {
    return isConnected && mongoose.connection.readyState === 1;
};

export default connectDB;