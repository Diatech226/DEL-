import {getPublicSettings} from '../../lib/api';
export default async function Confidentialite(){let text='';try{text=(await getPublicSettings()).privacyPolicy}catch{}return <main className="mx-auto max-w-4xl px-6 py-12"><h1 className="text-4xl font-black">Confidentialité</h1><p className="card mt-6 whitespace-pre-wrap">{text||'Texte à compléter par l’administration DEL.'}</p></main>}
