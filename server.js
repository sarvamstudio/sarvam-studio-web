// YEH LINE CHHUT GAYI THI! Ise sabse upar rakhna hai:
require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 1. CORS Middleware (Frontend block na ho)
app.use(cors());

// 2. Body Parser (Data read karne ke liye)
app.use(express.json());

// 3. Static Folder (Photos browser mein dikhane ke liye)
app.use('/uploads', express.static('uploads'));

// 4. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Studio ka Database Connect ho gaya!'))
  .catch((err) => console.log('❌ Database Connection Failed:', err));

// 5. Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/photos', require('./routes/photos'));
app.use('/api/reviews', require('./routes/reviews')); // 🔥 Yeh nayi line add ki hai

// 6. Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server chal pada hai port ${PORT} par`);
});