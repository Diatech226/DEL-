module.exports = function generateInvoiceNumber(prefix = 'DEL-INV') {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rand = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `${prefix || 'DEL-INV'}-${ymd}-${rand}`;
};
