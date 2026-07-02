require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');
const env = require('./src/config/env');

const start = async () => {
  await connectDB();
  app.listen(env.port, () => console.log(`DEL-api running on port ${env.port}`));
};

start().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
