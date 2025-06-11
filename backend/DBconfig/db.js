import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

console.log(process.env.MONGO_URL);


export const connectDB = () => {mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log('Connected to server !!!', mongoose.connection.host);
})
.catch((err) => {
    console.log('Server connection error !!!', err.message);
})}