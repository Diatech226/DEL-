const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  if (!env.mongodbUri) {
    throw new Error('MONGODB_URI is required to connect DEL-api to MongoDB.');
  }

  const connection = await mongoose.connect(env.mongodbUri);
  console.log(`MongoDB connected: ${connection.connection.host}`);
};

module.exports = connectDB;
