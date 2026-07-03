import React from 'react';

export const MessagesView: React.FC = () => (
  <div className="space-y-4">
    <div>
      <h1 className="text-2xl font-black text-slate-900">Messages</h1>
      <p className="text-sm text-slate-500">Messagerie administrateur DEL.</p>
    </div>
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h2 className="font-bold text-slate-900 mb-2">Messages à connecter après création API</h2>
      <p className="text-sm text-slate-600 max-w-3xl">
        L’inspection de DEL-api ne trouve pas de routes ni modèles Conversation/Message dédiés
        (`GET /api/conversations`, détail conversation, réponse admin, note interne, changement de statut).
        Cette itération garde donc DEL-cms-main autonome et affiche ce placeholder sans inventer une messagerie côté frontend.
      </p>
      <div className="mt-4 grid md:grid-cols-2 gap-3 text-xs text-slate-600">
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3"><b>Endpoints attendus</b><br />GET /api/conversations<br />GET /api/conversations/:id<br />POST /api/conversations/:id/messages<br />PATCH /api/conversations/:id/status</div>
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3"><b>Statut</b><br />API absente : liste, détail, réponse admin, note interne et changement de statut restent en attente.</div>
      </div>
    </div>
  </div>
);
