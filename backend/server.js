
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'https://kiara-wheel-5trf.onrender.com',
  'https://www.the7pricelessgifts.com/'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Kiara Wheel API is running!');
});

app.use('/api/session', require('./routes/session'));
app.use('/api/wheel', require('./routes/wheel'));
app.use('/api/result', require('./routes/result'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/review', require('./routes/review'));


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
