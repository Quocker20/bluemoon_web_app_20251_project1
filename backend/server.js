// File: backend/server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// === ĐÃ SỬA: CHẠY DOTENV TRƯỚC ===
// Phải chạy dotenv.config() ngay lập tức ở dòng đầu tiên
// để đảm bảo process.env.MONGO_URI có sẵn
// trước khi chúng ta gọi file config/db.js
dotenv.config();

// Bây giờ mới gọi connectDB (sau khi đã có biến môi trường)
const connectDB = require('./config/db');

// Gọi hàm kết nối CSDL
connectDB();

// Khởi tạo app Express
const app = express();
app.use(express.json()); 
app.use(cors());
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
// API Test
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Lấy cổng (PORT) từ file .env
const PORT = process.env.PORT || 5000;

// Chạy server
app.listen(PORT, () => {
  console.log(`(Backend) Server running on port ${PORT}`);
});