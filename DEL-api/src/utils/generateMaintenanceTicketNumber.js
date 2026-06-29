module.exports = function generateMaintenanceTicketNumber(date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `DEL-MTN-${yyyy}${mm}${dd}-${random}`;
};
