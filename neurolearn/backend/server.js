const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes (Placeholders)
app.use('/api', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/recommendation', require('./routes/recommendation'));
app.use('/api/profile', require('./routes/profile'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/neurolearn')
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch(err => console.error('Could not connect to MongoDB:', err));
