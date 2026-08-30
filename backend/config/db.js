const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Do not exit the process, just log the error so the server can still run without DB for now
    console.log('Ensure you have placed a valid MONGO_URI in backend/.env');
  }
};

module.exports = connectDB;
