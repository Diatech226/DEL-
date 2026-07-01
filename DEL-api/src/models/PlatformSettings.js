const mongoose = require('mongoose');
const currencies = ['XOF', 'USD', 'EUR'];
const string = { type: String, trim: true, default: '' };
const schema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: 'default', immutable: true },
  platformName: string, legalName: string, slogan: string, description: string, logoUrl: string, faviconUrl: string, primaryColor: string, secondaryColor: string, accentColor: string,
  email: string, phone: string, whatsapp: string, website: string, address: string, country: string, city: string,
  rccm: string, ifu: string, taxNumber: string, registrationNumber: string,
  defaultCurrency: { type: String, enum: currencies, default: 'XOF' }, enabledCurrencies: { type: [String], enum: currencies, default: ['XOF', 'USD', 'EUR'] }, defaultPlatformCommissionRate: { type: Number, min: 0, max: 100, default: 10 }, defaultTaxRate: { type: Number, min: 0, default: 0 }, invoicePrefix: string, contractPrefix: string, paymentPrefix: string,
  allowPublicEquipmentSubmission: { type: Boolean, default: true }, allowPublicRequestSubmission: { type: Boolean, default: true }, requireAdminApprovalForEquipment: { type: Boolean, default: true }, requireAdminApprovalForRequests: { type: Boolean, default: true }, requireDocumentsForVerification: { type: Boolean, default: true }, enableTenderModule: { type: Boolean, default: true }, enableTenderSubmissions: { type: Boolean, default: true }, enableScoring: { type: Boolean, default: true }, enablePdfReports: { type: Boolean, default: true }, enableInternalMessaging: { type: Boolean, default: true }, enableNotifications: { type: Boolean, default: true },
  termsOfService: string, privacyPolicy: string, rentalTerms: string, ownerTerms: string, companyTerms: string, investmentDisclaimer: string, paymentTerms: string, contractLegalNotice: string, invoiceLegalNotice: string,
  homepageHeroTitle: string, homepageHeroSubtitle: string, homepageCtaText: string, equipmentSubmissionNotice: string, requestSubmissionNotice: string, tenderSubmissionNotice: string,
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
module.exports = mongoose.model('PlatformSettings', schema);
