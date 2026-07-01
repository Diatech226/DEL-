const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  if (!env.mongodbUri) {
    if (env.nodeEnv === 'production') {
      throw new Error('MONGODB_URI is required to connect DEL-api to MongoDB.');
    }

    console.warn('MONGODB_URI is not set; DEL-api is running without a database connection.');
    return null;
  }

  const connection = await mongoose.connect(env.mongodbUri);
  console.log(`MongoDB connected: ${connection.connection.host}`);
};

module.exports = connectDB;
