import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './DBconfig/db.js';
import router from './routing/routing.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for frontend Vite dev server (usually localhost:5173) and any origin
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Simple request logger
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        if (process.env.NODE_ENV !== 'production') {
            console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
        }
    });
    next();
});

// API Routes
app.use('/api', router);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Slate API is running smoothly 🚀',
        endpoints: {
            health: '/api/health',
            notes: '/api/user?id=:userId',
            user: '/api/login'
        }
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

// Start server
app.listen(port, async () => {
    console.log(`🚀 Slate Server is running at http://localhost:${port}`);
    await connectDB();
});

export default app;