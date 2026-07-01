const PDFDocument = require('pdfkit');

const COLORS = { charcoal: '#1f2933', gold: '#d6a31a', gray: '#6b7280', lightGray: '#e5e7eb', green: '#14532d' };

function safeFilename(filename) { return String(filename || 'DEL-document.pdf').replace(/[\r\n"]/g, '').replace(/[^\w.\-À-ÿ]/g, '-'); }
function createPdfDocument(res, filename) {
  const doc = new PDFDocument({ margin: 48, size: 'A4', bufferPages: true });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${safeFilename(filename)}"`);
  doc.pipe(res);
  return doc;
}
function ensureSpace(doc, h = 60) { if (doc.y + h > doc.page.height - 72) doc.addPage(); }
function addHeader(doc, title, settings = {}) {
  doc.rect(0, 0, doc.page.width, 92).fill(COLORS.charcoal);
  doc.fillColor(COLORS.gold).fontSize(28).font('Helvetica-Bold').text(settings.platformName || 'DEL', 48, 28, { continued: false });
  doc.fillColor('white').fontSize(10).font('Helvetica').text(settings.legalName || 'Plateforme de gestion d’engins industriels', 48, 60);
  doc.moveDown(3);
  doc.fillColor(COLORS.charcoal).fontSize(20).font('Helvetica-Bold').text(title, 48, 118);
  doc.fillColor(COLORS.gray).fontSize(9).font('Helvetica').text(`Date de génération : ${formatDate(new Date())}`, 48, 144);
  doc.moveTo(48, 166).lineTo(doc.page.width - 48, 166).strokeColor(COLORS.gold).lineWidth(2).stroke();
  doc.y = 186;
}
function addSectionTitle(doc, title) { ensureSpace(doc, 42); doc.moveDown(0.6); doc.fillColor(COLORS.green).fontSize(13).font('Helvetica-Bold').text(title); doc.moveTo(48, doc.y + 3).lineTo(doc.page.width - 48, doc.y + 3).strokeColor(COLORS.lightGray).lineWidth(1).stroke(); doc.moveDown(0.5); }
function printable(value) { if (value === undefined || value === null || value === '') return '—'; if (typeof value === 'boolean') return value ? 'Oui' : 'Non'; if (Array.isArray(value)) return value.length ? value.join(', ') : '—'; return String(value); }
function addKeyValue(doc, label, value) { ensureSpace(doc, 22); const y = doc.y; doc.fillColor(COLORS.gray).fontSize(9).font('Helvetica-Bold').text(`${label} :`, 54, y, { width: 150 }); doc.fillColor(COLORS.charcoal).font('Helvetica').text(printable(value), 210, y, { width: 330 }); doc.moveDown(0.45); }
function addFooter(doc) { const range = doc.bufferedPageRange(); for (let i = range.start; i < range.start + range.count; i += 1) { doc.switchToPage(i); const y = doc.page.height - 56; doc.moveTo(48, y - 10).lineTo(doc.page.width - 48, y - 10).strokeColor(COLORS.lightGray).lineWidth(1).stroke(); doc.fillColor(COLORS.gray).fontSize(8).font('Helvetica').text('Document généré automatiquement par DEL — Plateforme de gestion d’engins industriels.', 48, y, { align: 'center', width: doc.page.width - 96 }); doc.text('Ce document ne constitue pas une signature électronique officielle.', 48, y + 12, { align: 'center', width: doc.page.width - 96 }); } }
function formatCurrency(value, currency = 'XOF') { if (value === undefined || value === null || value === '') return '—'; return `${Number(value).toLocaleString('fr-FR')} ${currency || ''}`.trim(); }
function formatDate(value) { if (!value) return '—'; const date = new Date(value); if (Number.isNaN(date.getTime())) return '—'; return date.toLocaleDateString('fr-FR'); }
function addList(doc, rows, render) { if (!rows || rows.length === 0) { addKeyValue(doc, 'Liste', 'Aucune donnée'); return; } rows.forEach((row, index) => { ensureSpace(doc, 30); doc.fillColor(COLORS.charcoal).fontSize(10).font('Helvetica-Bold').text(`#${index + 1} ${render(row)}`); doc.moveDown(0.25); }); }
module.exports = { createPdfDocument, addHeader, addSectionTitle, addKeyValue, addFooter, formatCurrency, formatDate, addList };
