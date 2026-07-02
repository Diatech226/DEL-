require('dotenv').config();
const connectDB = require('../src/config/db');
const User = require('../src/models/User');
const Equipment = require('../src/models/Equipment');
const EquipmentRequest = require('../src/models/EquipmentRequest');
const Document = require('../src/models/Document');
const PlatformSettings = require('../src/models/PlatformSettings');
const { hashPassword } = require('../src/utils/password');
const { defaultSettings } = require('../src/utils/defaultSettings');

const DEMO_PASSWORD = 'Demo@DEL2026!';

async function upsertUser(email, data, passwordHash) {
  return User.findOneAndUpdate(
    { email },
    { $setOnInsert: { email, passwordHash }, $set: data },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function run() {
  await connectDB();
  const passwordHash = await hashPassword(DEMO_PASSWORD);

  const admin = await upsertUser('admin@del.demo', { fullName: 'Admin DEL Démo', role: 'ADMIN', accountType: 'INDIVIDUAL', status: 'VERIFIED', country: 'Burkina Faso', city: 'Ouagadougou' }, passwordHash);
  const owner = await upsertUser('proprietaire@del.demo', { fullName: 'Société Faso Engins', phone: '+22670000001', role: 'OWNER', accountType: 'COMPANY', status: 'VERIFIED', country: 'Burkina Faso', city: 'Ouagadougou' }, passwordHash);
  const company = await upsertUser('entreprise@del.demo', { fullName: 'Mine Houndé Operations', phone: '+22670000002', role: 'COMPANY', accountType: 'COMPANY', status: 'VERIFIED', country: 'Burkina Faso', city: 'Houndé' }, passwordHash);

  const equipmentSeeds = [
    { title: 'Camion benne — Faso Engins', category: 'Camion benne', brand: 'Mercedes-Benz', model: 'Actros', year: 2021, rentalPricePerMonth: 4500000 },
    { title: 'Pelle hydraulique — Faso Engins', category: 'Pelle hydraulique', brand: 'Caterpillar', model: '320D', year: 2020, rentalPricePerMonth: 6500000 },
    { title: 'Bulldozer — Faso Engins', category: 'Bulldozer', brand: 'Komatsu', model: 'D65', year: 2019, rentalPricePerMonth: 7000000 },
  ];

  const equipment = [];
  for (const item of equipmentSeeds) {
    const doc = await Equipment.findOneAndUpdate(
      { title: item.title, ownerUserId: owner._id },
      { $setOnInsert: { ownerUserId: owner._id, ownerName: owner.fullName, ownerPhone: owner.phone }, $set: { ...item, country: 'Burkina Faso', city: 'Ouagadougou', locationText: 'Parc matériel Faso Engins', condition: 'GOOD', currency: 'XOF', status: 'AVAILABLE', services: { forRent: true, minePlacement: true, btpPlacement: true, maintenanceIncluded: true } } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    equipment.push(doc);
  }

  const request = await EquipmentRequest.findOneAndUpdate(
    { title: '2 camions bennes à Houndé pour 6 mois', companyUserId: company._id },
    { $setOnInsert: { companyUserId: company._id }, $set: { companyName: company.fullName, contactName: 'Responsable achats Houndé', contactPhone: company.phone, title: '2 camions bennes à Houndé pour 6 mois', equipmentCategory: 'Camion benne', quantity: 2, country: 'Burkina Faso', city: 'Houndé', siteName: 'Mine de Houndé', workSiteLocation: 'Site minier Houndé', durationMonths: 6, proposedPrice: 9000000, currency: 'XOF', priceUnit: 'MONTH', driverRequired: true, maintenanceIncluded: true, description: 'Besoin de deux camions bennes disponibles pour une mission minière de six mois.', status: 'OPEN' } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await Document.findOneAndUpdate(
    { title: 'Carte grise camion benne démo', entityId: equipment[0]._id },
    { $setOnInsert: { uploadedByUserId: owner._id }, $set: { title: 'Carte grise camion benne démo', type: 'Carte grise', entityType: 'EQUIPMENT', entityId: equipment[0]._id, ownerName: owner.fullName, uploadedBy: owner.fullName, fileUrl: 'https://example.com/demo/carte-grise-camion-benne.pdf', fileName: 'carte-grise-camion-benne.pdf', mimeType: 'application/pdf', status: 'PENDING', notes: 'Document de démonstration non contractuel.' } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await PlatformSettings.findOneAndUpdate(
    { key: 'default' },
    { $setOnInsert: { ...defaultSettings, key: 'default', updatedBy: admin._id }, $set: { investmentDisclaimer: 'DEL MVP est une plateforme de mise en relation, gestion et suivi. Paiement réel, signature électronique, financement, dividendes et investissement fractionné sont à venir et ne sont pas actifs dans cette version.', paymentTerms: 'Les factures du MVP servent au suivi administratif. Le paiement réel automatisé sera activé ultérieurement.', contractLegalNotice: 'Contrat simple de démonstration. Toute signature officielle doit être validée juridiquement avant production.' } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log('Données de démonstration DEL créées/mises à jour.');
  console.log('Comptes: admin@del.demo, proprietaire@del.demo, entreprise@del.demo');
  console.log(`Mot de passe démo: ${DEMO_PASSWORD} (local uniquement)`);
  console.log(`Demande créée: ${request.title}`);
  process.exit(0);
}
run().catch((error) => { console.error(error); process.exit(1); });
