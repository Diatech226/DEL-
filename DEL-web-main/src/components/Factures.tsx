import React, { useEffect, useMemo, useState } from 'react';
import { Download, Eye, FileText, ReceiptText, Search, X } from 'lucide-react';
import { getErrorMessage, unwrapData } from '../lib/http';
import { getMyInvoices } from '../services/invoice.service';
import { getMyPayments } from '../services/payment.service';
import { downloadInvoicePdf } from '../services/report.service';
import { DesignInvoice, mapApiInvoiceListToDesign } from '../mappers/invoice.mapper';
import { DesignPayment, mapApiPaymentListToDesign } from '../mappers/payment.mapper';
import { getStatusLabel, getStatusVariant } from '../constants/status';

interface FacturesProps {
  invoices?: unknown[];
  onNavigate: (screen: string) => void;
}

const money = (amount: number, currency = 'XOF') => `${Number(amount || 0).toLocaleString('fr-FR')} ${currency}`;
const date = (value?: string) => value ? new Date(value).toLocaleDateString('fr-FR') : '—';
const chipClass = (status?: string) => {
  const variant = getStatusVariant(status);
  if (variant === 'success') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  if (variant === 'warning') return 'bg-amber-50 text-amber-700 border-amber-100';
  if (variant === 'danger') return 'bg-rose-50 text-rose-700 border-rose-100';
  return 'bg-gray-50 text-gray-600 border-gray-100';
};

export default function Factures({ onNavigate }: FacturesProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [invoices, setInvoices] = useState<DesignInvoice[]>([]);
  const [payments, setPayments] = useState<DesignPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<DesignInvoice | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<DesignPayment | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadFinancialData() {
      setLoading(true);
      setError(null);
      setPdfError(null);
      try {
        const [invoiceResponse, paymentResponse] = await Promise.all([getMyInvoices(), getMyPayments()]);
        if (!mounted) return;
        setInvoices(mapApiInvoiceListToDesign(unwrapData(invoiceResponse)));
        setPayments(mapApiPaymentListToDesign(unwrapData(paymentResponse)));
      } catch (err) {
        if (mounted) setError(getErrorMessage(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    void loadFinancialData();
    return () => { mounted = false; };
  }, []);

  const filteredInvoices = useMemo(() => invoices.filter((inv) => {
    const needle = search.toLowerCase();
    const matchesSearch = [inv.invoiceNumber, inv.title, inv.companyName, inv.contractId].some((value) => String(value || '').toLowerCase().includes(needle));
    const matchesStatus = statusFilter === 'Tous' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [invoices, search, statusFilter]);

  const summary = useMemo(() => ({
    invoiceCount: invoices.length,
    totalDue: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
    paid: invoices.reduce((sum, inv) => sum + inv.amountPaid, 0),
    balance: invoices.reduce((sum, inv) => sum + inv.balanceDue, 0),
    paymentCount: payments.length,
    currency: invoices[0]?.currency || payments[0]?.currency || 'XOF',
  }), [invoices, payments]);

  const handleDownloadPdf = async (invoice: DesignInvoice) => {
    if (!invoice.id) return;
    setPdfError(null);
    setDownloadingId(invoice.id);
    try {
      await downloadInvoicePdf(invoice.id);
    } catch (err) {
      setPdfError(getErrorMessage(err));
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto p-6 space-y-6" id="screen-factures">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="font-sans text-2xl font-black text-gray-950">Facturation & Paiements</h1>
          <p className="text-xs text-gray-500">Factures et paiements utilisateur chargés depuis DEL-api.</p>
        </div>
        <button onClick={() => onNavigate('Dashboard Entreprise - DEL-web')} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50">Retour dashboard</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {([['Factures', summary.invoiceCount], ['Montant total dû', money(summary.totalDue, summary.currency)], ['Montant payé', money(summary.paid, summary.currency)], ['Solde restant', money(summary.balance, summary.currency)], ['Paiements', summary.paymentCount]] as Array<[string, React.ReactNode]>).map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
            <p className="font-sans text-xl font-black text-gray-950">{value}</p>
          </div>
        ))}
      </div>

      {loading && <div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm font-bold text-gray-600">Chargement des factures et paiements…</div>}
      {error && <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-700">{error}</div>}
      {pdfError && <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-bold text-amber-700">{pdfError}</div>}

      {!loading && !error && (
        <>
          <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher par n° de facture, titre, entreprise ou contrat..." className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-xs font-medium text-gray-800 focus:border-amber-500 focus:bg-white focus:outline-none" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700">
              {(['Tous', ...Array.from(new Set(invoices.map((inv) => inv.status)))] as string[]).map((status) => <option key={status} value={status}>{status === 'Tous' ? 'Tous' : getStatusLabel(status)}</option>)}
            </select>
          </div>

          <section className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 p-5"><h2 className="font-sans text-sm font-black text-gray-950">Liste factures utilisateur</h2><p className="text-[11px] text-gray-500">Paiement en ligne à venir.</p></div>
            {filteredInvoices.length === 0 ? <div className="p-6 text-sm font-bold text-gray-500">Aucune facture à afficher.</div> : (
              <div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead><tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold uppercase text-gray-400"><th className="p-4 pl-6">Numéro</th><th className="p-4">Titre</th><th className="p-4">Entreprise</th><th className="p-4">Total</th><th className="p-4">Payé</th><th className="p-4">Solde</th><th className="p-4">Statut</th><th className="p-4">Échéance</th><th className="p-4 text-right pr-6">Actions</th></tr></thead><tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-800">
                {filteredInvoices.map((inv) => <tr key={inv.id || inv.invoiceNumber} className="hover:bg-gray-50/50"><td className="p-4 pl-6 font-mono font-bold text-gray-900">{inv.invoiceNumber}</td><td className="p-4"><div className="flex items-center gap-2"><FileText className="h-4 w-4 text-gray-400" />{inv.title}</div></td><td className="p-4 text-gray-600">{inv.companyName}</td><td className="p-4">{money(inv.totalAmount, inv.currency)}</td><td className="p-4">{money(inv.amountPaid, inv.currency)}</td><td className="p-4">{money(inv.balanceDue, inv.currency)}</td><td className="p-4"><span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${chipClass(inv.status)}`}>{getStatusLabel(inv.status)}</span></td><td className="p-4 text-gray-500">{date(inv.dueDate)}</td><td className="p-4 text-right pr-6"><div className="flex justify-end gap-2"><button onClick={() => setSelectedInvoice(inv)} className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50" title="Voir détail"><Eye className="h-4 w-4" /></button><button onClick={() => handleDownloadPdf(inv)} disabled={downloadingId === inv.id} className="rounded-lg border border-gray-200 p-2 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-50" title="Télécharger PDF"><Download className="h-4 w-4" /></button></div></td></tr>)}
              </tbody></table></div>
            )}
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 p-5"><h2 className="font-sans text-sm font-black text-gray-950">Liste paiements utilisateur</h2><p className="text-[11px] text-gray-500">Paiements enregistrés/confirmés par l’administration DEL.</p></div>
            {payments.length === 0 ? <div className="p-6 text-sm font-bold text-gray-500">Aucun paiement à afficher.</div> : (
              <div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead><tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold uppercase text-gray-400"><th className="p-4 pl-6">Numéro</th><th className="p-4">Facture</th><th className="p-4">Contrat</th><th className="p-4">Montant</th><th className="p-4">Méthode</th><th className="p-4">Référence</th><th className="p-4">Statut</th><th className="p-4">Date</th><th className="p-4 text-right pr-6">Détail</th></tr></thead><tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-800">
                {payments.map((payment) => <tr key={payment.id || payment.paymentNumber} className="hover:bg-gray-50/50"><td className="p-4 pl-6 font-mono font-bold text-gray-900">{payment.paymentNumber}</td><td className="p-4 font-mono text-gray-500">{payment.invoiceId || '—'}</td><td className="p-4 font-mono text-gray-500">{payment.contractId || '—'}</td><td className="p-4">{money(payment.amount, payment.currency)}</td><td className="p-4">{payment.method}</td><td className="p-4">{payment.reference || '—'}</td><td className="p-4"><span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${chipClass(payment.status)}`}>{getStatusLabel(payment.status)}</span></td><td className="p-4 text-gray-500">{date(payment.paymentDate || payment.createdAt)}</td><td className="p-4 text-right pr-6"><button onClick={() => setSelectedPayment(payment)} className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50" title="Voir détail"><ReceiptText className="h-4 w-4" /></button></td></tr>)}
              </tbody></table></div>
            )}
          </section>
        </>
      )}

      {selectedInvoice && <DetailModal title={`Facture ${selectedInvoice.invoiceNumber}`} onClose={() => setSelectedInvoice(null)}><DetailLine label="Titre" value={selectedInvoice.title} /><DetailLine label="Statut" value={getStatusLabel(selectedInvoice.status)} /><DetailLine label="Sous-total" value={money(selectedInvoice.subtotal, selectedInvoice.currency)} /><DetailLine label="Taxes" value={money(selectedInvoice.taxAmount, selectedInvoice.currency)} /><DetailLine label="Total" value={money(selectedInvoice.totalAmount, selectedInvoice.currency)} /><DetailLine label="Payé" value={money(selectedInvoice.amountPaid, selectedInvoice.currency)} /><DetailLine label="Solde" value={money(selectedInvoice.balanceDue, selectedInvoice.currency)} /><DetailLine label="Échéance" value={date(selectedInvoice.dueDate)} /><DetailLine label="Période" value={`${date(selectedInvoice.periodStart)} → ${date(selectedInvoice.periodEnd)}`} /><DetailLine label="Conditions" value={selectedInvoice.paymentTerms || '—'} /><DetailLine label="Notes" value={selectedInvoice.notes || '—'} /><button onClick={() => handleDownloadPdf(selectedInvoice)} className="mt-4 rounded-xl bg-amber-500 px-4 py-2 text-xs font-black text-gray-950 hover:bg-amber-600">Télécharger PDF</button></DetailModal>}
      {selectedPayment && <DetailModal title={`Paiement ${selectedPayment.paymentNumber}`} onClose={() => setSelectedPayment(null)}><DetailLine label="Entreprise" value={selectedPayment.companyName} /><DetailLine label="Facture liée" value={selectedPayment.invoiceId || '—'} /><DetailLine label="Contrat lié" value={selectedPayment.contractId || '—'} /><DetailLine label="Montant" value={money(selectedPayment.amount, selectedPayment.currency)} /><DetailLine label="Méthode" value={selectedPayment.method} /><DetailLine label="Référence" value={selectedPayment.reference || '—'} /><DetailLine label="Statut" value={getStatusLabel(selectedPayment.status)} /><DetailLine label="Date paiement" value={date(selectedPayment.paymentDate || selectedPayment.createdAt)} /><DetailLine label="Notes" value={selectedPayment.notes || '—'} /></DetailModal>}
    </div>
  );
}

function DetailModal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="mb-4 flex items-center justify-between"><h3 className="font-sans text-lg font-black text-gray-950">{title}</h3><button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100"><X className="h-4 w-4" /></button></div><div className="space-y-2">{children}</div></div></div>;
}

function DetailLine({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="flex justify-between gap-4 border-b border-gray-100 py-2 text-xs"><span className="font-bold uppercase text-gray-400">{label}</span><span className="text-right font-semibold text-gray-800">{value}</span></div>;
}
