module.exports = function generateMissionNumber() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `DEL-MIS-${ymd}-${suffix}`;
};
