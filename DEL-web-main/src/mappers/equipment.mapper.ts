import { Machine } from '../types';
import { normalizeStatus } from '../constants/status';
const PLACEHOLDER='https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=600&auto=format&fit=crop&q=80';
const designStatus=(s?:string): Machine['status']=>({AVAILABLE:'available',PLACED:'rented',RESERVED:'rented',UNDER_MAINTENANCE:'maintenance'}[normalizeStatus(s)] as Machine['status'] || 'offline');
export function mapApiEquipmentToDesign(e:any): Machine { return { id:String(e?._id||e?.id||''), brand:e?.brand||e?.manufacturer||'Marque à confirmer', model:e?.model||'Modèle à confirmer', type:e?.type||e?.equipmentType||'Engin', year:Number(e?.year||new Date().getFullYear()), category:e?.category||'Chantier', weight:Number(e?.weight||e?.weightTons||0), hourCounter:Number(e?.hourCounter||e?.hours||0), location:e?.location||e?.city||'Localisation à confirmer', dailyPrice:Number(e?.dailyPrice||e?.rentalPricePerDay||e?.pricePerDay||0), status:designStatus(e?.status), ownerId:String(e?.ownerId||e?.owner?._id||e?.owner?.id||''), ownerName:e?.ownerName||e?.owner?.fullName||e?.owner?.companyName||'Propriétaire DEL', serialNumber:e?.serialNumber||'N/A', vgpCertDate:e?.vgpCertDate||e?.lastInspectionDate||'', nextMaintenanceDate:e?.nextMaintenanceDate||'', enginePower:e?.enginePower||e?.power||'N/A', bucketCapacity:e?.bucketCapacity, fuelType:e?.fuelType||'GNR', imageUrl:e?.imageUrl||e?.photoUrl||e?.photos?.[0]?.url||e?.images?.[0]||PLACEHOLDER }; }
export const mapApiEquipmentListToDesign=(items:any):Machine[] => (Array.isArray(items?.data)?items.data:Array.isArray(items)?items:Array.isArray(items?.items)?items.items:[]).map(mapApiEquipmentToDesign);
const toNumber = (value: unknown, fallback = 0) => { const number = Number(value); return Number.isFinite(number) ? number : fallback; };
export function mapDesignEquipmentToApiPayload(form:any){ return {
  title: form.title || [form.brand, form.model].filter(Boolean).join(' ') || form.type || 'Engin DEL',
  category: form.category || form.type || 'Engin',
  brand: form.brand || '',
  model: form.model || '',
  year: toNumber(form.year, new Date().getFullYear()),
  serialNumber: form.serialNumber || '',
  condition: form.condition || 'GOOD',
  engineHours: toNumber(form.engineHours ?? form.hourCounter ?? form.hours, 0),
  country: form.country || 'Burkina Faso',
  city: form.city || form.location || '',
  locationText: form.locationText || form.location || '',
  ownerName: form.ownerName || '',
  ownerPhone: form.ownerPhone || '',
  rentalPricePerDay: toNumber(form.rentalPricePerDay ?? form.dailyPrice, 0),
  rentalPricePerMonth: toNumber(form.rentalPricePerMonth, 0),
  salePrice: toNumber(form.salePrice, 0),
  currency: form.currency || 'XOF',
  photos: Array.isArray(form.photos) ? form.photos : (form.imageUrl ? [form.imageUrl] : []),
  services: {
    forSale: Boolean(form.forSale),
    forRent: form.forRent !== false,
    minePlacement: Boolean(form.minePlacement),
    btpPlacement: Boolean(form.btpPlacement),
    fullManagement: Boolean(form.fullManagement),
    gpsTracking: Boolean(form.gpsTracking),
    cameraTracking: Boolean(form.cameraTracking),
    maintenanceIncluded: Boolean(form.maintenanceIncluded),
    insuranceIncluded: Boolean(form.insuranceIncluded),
    driverIncluded: Boolean(form.driverIncluded),
  },
  type: form.type,
  weight: toNumber(form.weight, 0),
  hourCounter: toNumber(form.hourCounter, 0),
  vgpCertDate: form.vgpCertDate || form.vgpDate,
  nextMaintenanceDate: form.nextMaintenanceDate || form.nextMaint,
  enginePower: form.enginePower,
  fuelType: form.fuelType || 'GNR',
}; }
