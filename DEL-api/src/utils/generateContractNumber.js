module.exports = function generateContractNumber(date = new Date(), prefix = 'DEL-CTR') {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `${prefix || 'DEL-CTR'}-${y}${m}${d}-${random}`;
};
