export interface AdminSettingsForm {
  platformName: string;
  legalName: string;
  slogan: string;
  description: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  email: string;
  phone: string;
  whatsapp: string;
  website: string;
  address: string;
  country: string;
  city: string;
  rccm: string;
  ifu: string;
  taxNumber: string;
  registrationNumber: string;
  defaultCurrency: string;
  enabledCurrencies: string[];
  defaultPlatformCommissionRate: number;
  defaultTaxRate: number;
  invoicePrefix: string;
  contractPrefix: string;
  paymentPrefix: string;
  allowPublicEquipmentSubmission: boolean;
  allowPublicRequestSubmission: boolean;
  requireAdminApprovalForEquipment: boolean;
  requireAdminApprovalForRequests: boolean;
  requireDocumentsForVerification: boolean;
  enableTenderModule: boolean;
  enableTenderSubmissions: boolean;
  enableScoring: boolean;
  enablePdfReports: boolean;
  enableInternalMessaging: boolean;
  enableNotifications: boolean;
  termsOfService: string;
  privacyPolicy: string;
  rentalTerms: string;
  ownerTerms: string;
  companyTerms: string;
  investmentDisclaimer: string;
  paymentTerms: string;
  contractLegalNotice: string;
  invoiceLegalNotice: string;
  homepageHeroTitle: string;
  homepageHeroSubtitle: string;
  homepageCtaText: string;
  equipmentSubmissionNotice: string;
  requestSubmissionNotice: string;
  tenderSubmissionNotice: string;
}

export const defaultAdminSettingsForm: AdminSettingsForm = {
  platformName: 'DEL', legalName: 'DEL', slogan: '', description: '', logoUrl: '', faviconUrl: '', primaryColor: '', secondaryColor: '', accentColor: '',
  email: '', phone: '', whatsapp: '', website: '', address: '', country: '', city: '',
  rccm: '', ifu: '', taxNumber: '', registrationNumber: '',
  defaultCurrency: 'XOF', enabledCurrencies: ['XOF', 'USD', 'EUR'], defaultPlatformCommissionRate: 10, defaultTaxRate: 0, invoicePrefix: '', contractPrefix: '', paymentPrefix: '',
  allowPublicEquipmentSubmission: false, allowPublicRequestSubmission: false, requireAdminApprovalForEquipment: true, requireAdminApprovalForRequests: true, requireDocumentsForVerification: true,
  enableTenderModule: false, enableTenderSubmissions: false, enableScoring: false, enablePdfReports: true, enableInternalMessaging: false, enableNotifications: false,
  termsOfService: '', privacyPolicy: '', rentalTerms: '', ownerTerms: '', companyTerms: '', investmentDisclaimer: '', paymentTerms: '', contractLegalNotice: '', invoiceLegalNotice: '',
  homepageHeroTitle: '', homepageHeroSubtitle: '', homepageCtaText: '', equipmentSubmissionNotice: '', requestSubmissionNotice: '', tenderSubmissionNotice: ''
};

const pick = (source: any, key: keyof AdminSettingsForm) => source?.[key] ?? defaultAdminSettingsForm[key];
const numberValue = (value: unknown, fallback: number) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const arrayValue = (value: unknown) => Array.isArray(value) ? value.map(String).filter(Boolean) : defaultAdminSettingsForm.enabledCurrencies;

export function mapApiSettingsToAdminForm(apiSettings: any): AdminSettingsForm {
  const source = apiSettings?.settings ?? apiSettings ?? {};
  return {
    ...defaultAdminSettingsForm,
    ...Object.fromEntries(Object.keys(defaultAdminSettingsForm).map((key) => [key, pick(source, key as keyof AdminSettingsForm)])),
    platformName: String(source.platformName || defaultAdminSettingsForm.platformName),
    legalName: String(source.legalName || defaultAdminSettingsForm.legalName),
    defaultCurrency: String(source.defaultCurrency || defaultAdminSettingsForm.defaultCurrency),
    enabledCurrencies: arrayValue(source.enabledCurrencies),
    defaultPlatformCommissionRate: numberValue(source.defaultPlatformCommissionRate, defaultAdminSettingsForm.defaultPlatformCommissionRate),
    defaultTaxRate: numberValue(source.defaultTaxRate, defaultAdminSettingsForm.defaultTaxRate)
  };
}

export function mapAdminFormToApiSettingsPayload(formState: AdminSettingsForm) {
  return {
    ...formState,
    enabledCurrencies: arrayValue(formState.enabledCurrencies),
    defaultPlatformCommissionRate: numberValue(formState.defaultPlatformCommissionRate, defaultAdminSettingsForm.defaultPlatformCommissionRate),
    defaultTaxRate: numberValue(formState.defaultTaxRate, defaultAdminSettingsForm.defaultTaxRate)
  };
}
