require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const { ensureAdminAccount } = require('../src/services/adminAccount.service');
const { sanitizeUser } = require('../src/utils/sanitizeUser');

async function run() {
  const resetPassword = process.argv.includes('--reset-password');
  await connectDB();
  const result = await ensureAdminAccount({ resetPassword });
  const safeUser = sanitizeUser(result.user);
  console.log(JSON.stringify({ success: true, created: result.created, passwordReset: result.passwordReset, admin: { id: safeUser.id, email: safeUser.email, role: safeUser.role, status: safeUser.status, mustChangePassword: safeUser.mustChangePassword } }, null, 2));
}
run().then(() => mongoose.connection.close()).catch(async (error) => { console.error(`Seed admin échoué: ${error.message}`); await mongoose.connection.close().catch(() => {}); process.exit(1); });
