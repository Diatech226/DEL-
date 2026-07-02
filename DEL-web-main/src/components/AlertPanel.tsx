import React, { useState } from 'react';
import { 
  Mail, 
  MailOpen, 
  Send, 
  Check, 
  X, 
  Bell, 
  Calendar, 
  ChevronRight, 
  Info,
  Inbox,
  AlertTriangle,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SimulatedEmail {
  id: string;
  to: string;
  subject: string;
  body: string;
  dateSent: string;
  machineId: string;
  status: 'Envoyé';
  read: boolean;
}

interface AlertPanelProps {
  emails: SimulatedEmail[];
  onMarkAsRead: (id: string) => void;
  onNavigate: (screen: string) => void;
}

export default function AlertPanel({ emails, onMarkAsRead, onNavigate }: AlertPanelProps) {
  const [selectedEmail, setSelectedEmail] = useState<SimulatedEmail | null>(null);
  const unreadCount = emails.filter(e => !e.read).length;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4" id="alert-panel-container">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="relative rounded-lg bg-rose-50 p-2 text-rose-600">
            <Mail className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-sans text-sm font-extrabold text-gray-950">
              Journal des Alertes E-mail Automatiques
            </h3>
            <p className="text-[11px] font-medium text-gray-500">
              Simulation d'envoi d'e-mails de sécurité en temps réel lors de détection de maintenance critique
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full font-bold">
          Statut SMTP: Connecté
        </span>
      </div>

      {/* Main Alert List */}
      {emails.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400 space-y-2">
          <Inbox className="h-10 w-10 text-gray-300" />
          <p className="text-xs font-semibold">Aucune alerte e-mail envoyée pour le moment</p>
          <p className="text-[10px] max-w-sm">Les alertes e-mail sont générées automatiquement lorsque vos engins s'approchent de leur date d'entretien.</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
          {emails.map((email) => (
            <div
              key={email.id}
              onClick={() => {
                setSelectedEmail(email);
                onMarkAsRead(email.id);
              }}
              className={`group flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                email.read 
                  ? 'bg-gray-50/50 border-gray-150 hover:bg-gray-50 hover:border-gray-300' 
                  : 'bg-rose-50/20 border-rose-100 hover:bg-rose-50/40 hover:border-rose-200'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className={`mt-0.5 rounded-full p-1.5 shrink-0 ${
                  email.read ? 'bg-gray-100 text-gray-400' : 'bg-rose-100 text-rose-600 animate-pulse'
                }`}>
                  {email.read ? <MailOpen className="h-3.5 w-3.5" /> : <Mail className="h-3.5 w-3.5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 shrink-0">
                      À: {email.to}
                    </span>
                    <span className="text-[9px] font-mono text-gray-400">•</span>
                    <span className="text-[10px] text-gray-400 shrink-0">{email.dateSent}</span>
                    {!email.read && (
                      <span className="text-[9px] font-black uppercase tracking-wider text-rose-600 bg-rose-100/60 px-1.5 py-0.5 rounded-md shrink-0">
                        Nouveau
                      </span>
                    )}
                  </div>
                  <h4 className={`text-xs mt-0.5 truncate ${email.read ? 'font-medium text-gray-700' : 'font-extrabold text-gray-900'}`}>
                    {email.subject}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-3">
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="h-2.5 w-2.5" /> Sent
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Warning Footer */}
      <div className="rounded-xl bg-amber-50/40 border border-amber-100 p-3 flex items-start gap-2.5">
        <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed text-amber-800">
          <strong>Mode simulation actif</strong> : Pour chaque engin nécessitant un entretien sous 7 jours ou dépassé, le système envoie une notification e-mail automatique à l'adresse propriétaire. Dans un environnement de production réel, ces tâches sont exécutées par un démon de maintenance quotidien via AWS SES / Mailgun.
        </p>
      </div>

      {/* Email Viewer Modal */}
      <AnimatePresence>
        {selectedEmail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4" id="email-viewer-modal">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Email Mock Header */}
              <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-rose-500/20 p-1.5 text-rose-400">
                    <Send className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-mono">SERVEUR SMTP DEL-WEB</span>
                    <h4 className="text-xs font-bold font-mono">Aperçu d'Email Envoyé</h4>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="rounded-full p-1.5 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Email Metadata */}
              <div className="p-4 border-b border-gray-100 bg-gray-50/80 space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <div><strong>De :</strong> security-alerts@del-web.fr</div>
                  <div className="font-mono text-[10px] text-gray-400">{selectedEmail.dateSent}</div>
                </div>
                <div><strong>À :</strong> {selectedEmail.to}</div>
                <div className="pt-1 text-gray-900 font-extrabold text-sm">
                  <strong>Objet :</strong> {selectedEmail.subject}
                </div>
              </div>

              {/* Email Body Content */}
              <div className="p-5 flex-1 overflow-y-auto bg-white border-b border-gray-100">
                <div className="font-sans text-xs text-gray-800 leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedEmail.body}
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 bg-gray-50 flex items-center justify-between gap-3">
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="h-3 w-3" /> Délivré avec succès via le relais SMTP
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedEmail(null)}
                    className="rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Fermer
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEmail(null);
                      onNavigate('Liste Détaillée de Maintenance - DEL-web');
                    }}
                    className="rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-700 transition-colors flex items-center gap-1"
                  >
                    <AlertTriangle className="h-3 w-3" /> Gérer l'Entretien
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
