export function formatCurrency(value) {
  const n = Number(value) || 0;
  return n.toLocaleString('es-DO', {
    style: 'currency',
    currency: 'DOP',
    maximumFractionDigits: 0,
  });
}

export function formatDate(isoDate) {
  if (!isoDate) return '—';
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Devuelve la clave "YYYY-MM" a partir de una fecha ISO "YYYY-MM-DD"
export function monthKeyFromDate(isoDate) {
  return isoDate ? isoDate.slice(0, 7) : '';
}

export function currentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export function monthLabel(monthKey) {
  if (!monthKey) return '';
  const [y, m] = monthKey.split('-').map(Number);
  return `${MESES[m - 1]} ${y}`;
}

export function shiftMonth(monthKey, delta) {
  const [y, m] = monthKey.split('-').map(Number);
  const date = new Date(y, m - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

// Próxima fecha de pago a partir de un día del mes (1-31)
export function nextPaymentDate(paymentDay) {
  if (!paymentDay) return null;
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth();
  if (today.getDate() > paymentDay) {
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
  }
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const day = Math.min(paymentDay, daysInMonth);
  return new Date(year, month, day);
}

export function daysUntil(date) {
  if (!date) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

export function genId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
