export const LoadingState=({message='Chargement…'}:{message?:string})=><div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm font-semibold text-gray-500">{message}</div>;
export const ErrorState=({message}:{message:string})=><div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm font-semibold text-red-700">{message}</div>;
export const EmptyState=({message='Aucune donnée disponible.'}:{message?:string})=><div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm font-semibold text-gray-500">{message}</div>;
