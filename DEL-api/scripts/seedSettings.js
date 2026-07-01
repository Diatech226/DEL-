require('dotenv').config();
const connectDB = require('../src/config/db');
const PlatformSettings = require('../src/models/PlatformSettings');
const { defaultSettings } = require('../src/utils/defaultSettings');
async function run() { await connectDB(); const existing = await PlatformSettings.findOne({ key: 'default' }); if (existing) { console.log('PlatformSettings default existe déjà, aucun écrasement.'); process.exit(0); } await PlatformSettings.create({ ...defaultSettings, key: 'default' }); console.log('PlatformSettings default créé.'); process.exit(0); }
run().catch((e) => { console.error(e); process.exit(1); });
