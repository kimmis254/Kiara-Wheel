// server.js

// 1. Import Dependencies
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// 2. Load Environment Variables
dotenv.config();

// 3. Initialize Express App
const app = express();
app.use(cors());
app.use(express.json());

// 4. Health Check Endpoint
app.get('/', (req, res) => {
  res.send('✅ Kiara Wheel API is running!');
});

// 5. Import and Use Routes
const sessionRoutes = require('./routes/session');
const wheelRoutes = require('./routes/wheel');
const resultRoutes = require('./routes/result');
app.use('/api/session', sessionRoutes);
app.use('/api/wheel', wheelRoutes);
app.use('/api/result', resultRoutes);


// 6. Connect to MongoDB, then Start Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1); // Exit process if DB connection fails
  });
