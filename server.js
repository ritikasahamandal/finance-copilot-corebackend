import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // Note: You MUST include the .js extension when importing local files in ESM!
import router from './routes/authRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', router);

app.get('/health', (req, res) => res.status(200).json({ status: 'healthy' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Core Server up and running on port ${PORT}`);
});