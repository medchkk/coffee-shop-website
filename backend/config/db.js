const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('🗄️  MongoDB connection established');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB connection disconnected');
    });

  } catch (err) {
    console.error(`❌ MongoDB connection failed: ${err.message}`);
    console.log('💡 Tips: Check if MongoDB is running and MONGO_URI is correct');
    process.exit(1);
  }
};

// Configure mongoose to use newer parser
mongoose.set('strictQuery', true);

module.exports = connectDB;
