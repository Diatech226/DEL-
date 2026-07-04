const toNumber = (value: unknown, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

export function mapDesignRequestToApiPayload(formState: any) {
  return {
    companyName: formState.companyName || formState.clientCompany || '',
    contactName: formState.contactName || formState.fullName || '',
    contactPhone: formState.contactPhone || formState.phone || '',
    contactEmail: formState.contactEmail || formState.email || '',
    equipmentCategory: formState.equipmentCategory || formState.machineType || formState.type || '',
    quantity: toNumber(formState.quantity, 1) || 1,
    country: formState.country || 'Burkina Faso',
    city: formState.city || formState.location || '',
    workSiteLocation: formState.workSiteLocation || formState.location || '',
    startDate: formState.startDate || '',
    endDate: formState.endDate || '',
    durationMonths: toNumber(formState.durationMonths ?? formState.duration, 0),
    proposedPrice: toNumber(formState.proposedPrice ?? formState.maxBudget ?? formState.maxBudgetPerDay, 0),
    currency: formState.currency || 'XOF',
    driverRequired: Boolean(formState.driverRequired),
    fuelIncluded: Boolean(formState.fuelIncluded),
    maintenanceIncluded: Boolean(formState.maintenanceIncluded),
    insuranceRequired: Boolean(formState.insuranceRequired),
    specialConditions: formState.specialConditions || formState.description || formState.title || '',
  };
}

export const mapApiRequestToDesign = (item: any) => ({ ...item, id: String(item?._id || item?.id || '') });
export const mapApiRequestListToDesign = (items: any) => (Array.isArray(items?.data) ? items.data : Array.isArray(items) ? items : Array.isArray(items?.items) ? items.items : []).map(mapApiRequestToDesign);
