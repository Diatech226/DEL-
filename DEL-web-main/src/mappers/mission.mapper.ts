export const mapApiMissionToDesign = (item: any) => ({ ...item, id: String(item?._id || item?.id || '') });
export const mapApiMissionListToDesign = (items: any) => (Array.isArray(items?.data) ? items.data : Array.isArray(items) ? items : Array.isArray(items?.items) ? items.items : []).map(mapApiMissionToDesign);
