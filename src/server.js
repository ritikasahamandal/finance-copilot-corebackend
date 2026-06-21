const express = require('express');
const cors= require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));

// Basic health check route(new thing I learned)
app.get('/health', (req, res) => res.status(200).json({ status: 'healthy' }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Core Server up and running on port ${PORT}`);
});