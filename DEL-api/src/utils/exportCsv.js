function normalizeCsvValue(value) {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value) || (typeof value === 'object' && value.constructor === Object)) return JSON.stringify(value);
  return String(value);
}

function escapeCsvValue(value) {
  const normalized = normalizeCsvValue(value);
  if (/[",\n\r]/.test(normalized)) return `"${normalized.replace(/"/g, '""')}"`;
  return normalized;
}

function getValue(row, key) {
  return key.split('.').reduce((value, part) => (value === null || value === undefined ? undefined : value[part]), row);
}

function convertToCsv(rows, columns) {
  const header = columns.map((column) => escapeCsvValue(column.label || column.key)).join(',');
  const lines = (rows || []).map((row) => columns.map((column) => escapeCsvValue(getValue(row, column.key))).join(','));
  return [header, ...lines].join('\n');
}

module.exports = { escapeCsvValue, convertToCsv };
