import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './DBconfig/db.js';
import router from './routing/routing.js';

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());


app.use('/api/', router)


app.listen(port, () => {
    connectDB();
    console.log(`Server running at: ${port}`);
})