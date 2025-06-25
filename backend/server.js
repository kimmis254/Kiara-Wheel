// server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Define allowed origins for CORS
const allowedOrigins = [
  'http://localhost:3000', // For local frontend development
  'http://localhost:5000', // If frontend is on same port
  'https://your-frontend-site.onrender.com', // Replace with your *actual* Render frontend URL
  // Add any other specific domains that need to access your API
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
  credentials: true, // Allow cookies to be sent with requests
  optionsSuccessStatus: 204 // Some legacy browsers (IE11, various SmartTVs) choke on 200
}));
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.send('✅ Kiara Wheel API is running!');
});

// Register API routes
app.use('/api/session', require('./routes/session'));
app.use('/api/wheel', require('./routes/wheel'));
app.use('/api/result', require('./routes/result'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/review', require('./routes/review'));


// Connect to MongoDB and start server
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
