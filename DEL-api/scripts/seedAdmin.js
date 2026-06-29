const bcrypt = require('bcryptjs');
const connectDB = require('../src/config/db');
const env = require('../src/config/env');
const User = require('../src/models/User');

async function run() {
  await connectDB();
  if (!env.adminEmails.length) throw new Error('ADMIN_EMAILS est vide.');
  const passwordHash = await bcrypt.hash('changer-moi-123', 10);
  for (const email of env.adminEmails) {
    const existing = await User.findOne({ email });
    if (existing) {
      existing.role = 'ADMIN'; existing.status = 'VERIFIED'; if (!existing.passwordHash) existing.passwordHash = passwordHash; await existing.save();
      console.log(`Admin mis à jour: ${email}`);
    } else {
      await User.create({ fullName: `Admin DEL ${email}`, email, passwordHash, role: 'ADMIN', accountType: 'INDIVIDUAL', status: 'VERIFIED', preferredLanguage: 'fr' });
      console.log(`Admin créé: ${email}`);
    }
  }
  process.exit(0);
}
run().catch((error) => { console.error(error); process.exit(1); });
