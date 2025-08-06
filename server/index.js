const express = require('express');
const cors = require('cors');
// const dotenv = require('dotenv');
const connectDB = require('./config/db');

// dotenv.config();
// console.log("Loaded MONGO_URI:", process.env.MONGO_URI);
const dotenv = require('dotenv');
dotenv.config(); // Load .env before using MONGO_URI

connectDB();
const path = require('path');
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads')); // to serve documents

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/docs', require('./routes/documentRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
