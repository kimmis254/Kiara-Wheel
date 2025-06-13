const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
app.use(express.json());

const corsOptions = {
  origin: '*', // allow your frontend dev origin
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));


// Serve public images
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/', (req, res) => {
  res.send('✅ Kiara Wheel API is running!');
});

// Register routes
app.use('/api/session', require('./routes/session'));
app.use('/api/wheel', require('./routes/wheel'));
app.use('/api/result', require('./routes/result'));
app.use('/api/upload', require('./routes/upload')); // ✅ NEW

// Connect MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });
