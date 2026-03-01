import express from 'express';
import cors from 'cors';
import router from './routes/index.js';

const app = express();

app.use(cors({
    origin: ["https://mt231043-10993.node.ustp.cloud", "http://localhost:5173", "http://localhost:4321"],
    credentials: true
}));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use(express.json());
app.use(express.static('public'));

app.use('/api', router);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

export default app;