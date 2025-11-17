// File: backend/config/db.js

const mongoose = require('mongoose');

// Hàm kết nối CSDL bất đồng bộ (async)
const connectDB = async () => {
  try {
    // Mongoose sẽ tự động đọc biến MONGO_URI từ file .env
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`(Backend) MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`(Backend) Error: ${error.message}`);
    process.exit(1); // Thoát tiến trình nếu kết nối thất bại
  }
};

module.exports = connectDB;