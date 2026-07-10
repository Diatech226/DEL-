require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');
const env = require('./src/config/env');
const { ensureAdminAccount } = require('./src/services/adminAccount.service');

const start = async () => {
  await connectDB();
  try {
    await ensureAdminAccount();
  } catch (error) {
    console.error(`Impossible de garantir le compte administrateur: ${error.message}`);
    if (env.nodeEnv === 'production') process.exit(1);
    console.warn('Démarrage poursuivi sans compte administrateur garanti (hors production).');
  }
  app.listen(env.port, () => console.log(`DEL-api running on port ${env.port}`));
};

start().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
