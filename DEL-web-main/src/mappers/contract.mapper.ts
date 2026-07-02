export const mapApiContractToDesign = (item: any) => ({ ...item, id: String(item?._id || item?.id || '') });
export const mapApiContractListToDesign = (items: any) => (Array.isArray(items?.data) ? items.data : Array.isArray(items) ? items : Array.isArray(items?.items) ? items.items : []).map(mapApiContractToDesign);
