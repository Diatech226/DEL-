export const mapApiRequestToDesign = (item: any) => ({ ...item, id: String(item?._id || item?.id || '') });
export const mapApiRequestListToDesign = (items: any) => (Array.isArray(items?.data) ? items.data : Array.isArray(items) ? items : Array.isArray(items?.items) ? items.items : []).map(mapApiRequestToDesign);
