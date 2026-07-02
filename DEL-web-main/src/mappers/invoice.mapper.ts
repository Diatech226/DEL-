export const mapApiInvoiceToDesign = (item: any) => ({ ...item, id: String(item?._id || item?.id || '') });
export const mapApiInvoiceListToDesign = (items: any) => (Array.isArray(items?.data) ? items.data : Array.isArray(items) ? items : Array.isArray(items?.items) ? items.items : []).map(mapApiInvoiceToDesign);
