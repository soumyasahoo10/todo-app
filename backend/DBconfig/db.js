import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export const connectDB = () => {mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log('Connected to server !!!', mongoose.connection.host);
})
.catch(() => {
    console.log('Server connection error !!!');
})}