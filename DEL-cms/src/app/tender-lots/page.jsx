const titles = {
  messages: 'Messages',
  'tender-lots': 'Lots d’appel d’offres',
  'tender-submissions': 'Soumissions aux appels d’offres',
  scoring: 'Scoring',
};

export default function Page() {
  const title = titles['tender-lots'];
  return (
    <main className="space-y-4">
      <h1 className="text-3xl font-black text-coal">{title}</h1>
      <p className="rounded-xl bg-white p-6 text-slate-600 shadow-sm">
        Aucun élément à afficher pour le moment.
      </p>
    </main>
  );
}
