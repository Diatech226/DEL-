const PlatformSettings = require('../models/PlatformSettings');
const { defaultSettings } = require('./defaultSettings');
async function getOrCreateSettings() {
  let settings = await PlatformSettings.findOne({ key: 'default' });
  if (!settings) settings = await PlatformSettings.create({ ...defaultSettings, key: 'default' });
  return settings;
}
function publicSettings(s) { return {
  platformName: s.platformName, legalName: s.legalName, slogan: s.slogan, description: s.description, logoUrl: s.logoUrl, faviconUrl: s.faviconUrl,
  colors: { primaryColor: s.primaryColor, secondaryColor: s.secondaryColor, accentColor: s.accentColor },
  contact: { email: s.email, phone: s.phone, whatsapp: s.whatsapp, website: s.website, address: s.address, country: s.country, city: s.city },
  enabledCurrencies: s.enabledCurrencies,
  homepageHeroTitle: s.homepageHeroTitle, homepageHeroSubtitle: s.homepageHeroSubtitle, homepageCtaText: s.homepageCtaText, equipmentSubmissionNotice: s.equipmentSubmissionNotice, requestSubmissionNotice: s.requestSubmissionNotice, tenderSubmissionNotice: s.tenderSubmissionNotice,
  allowPublicEquipmentSubmission: s.allowPublicEquipmentSubmission, allowPublicRequestSubmission: s.allowPublicRequestSubmission, enableTenderModule: s.enableTenderModule, enableTenderSubmissions: s.enableTenderSubmissions,
  termsOfService: s.termsOfService, privacyPolicy: s.privacyPolicy, rentalTerms: s.rentalTerms, ownerTerms: s.ownerTerms, companyTerms: s.companyTerms
}; }
module.exports = { getOrCreateSettings, publicSettings };
