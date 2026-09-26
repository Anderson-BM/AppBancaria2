import { formatCurrency, nextPaymentDate, daysUntil } from '../../utils/format.js';
import './SummaryCards.css';

export default function SummaryCards({ card, totalSpent }) {
  const limit = card.limit || 0;
  const available = Math.max(limit - totalSpent, 0);
  const percentUsed = limit > 0 ? Math.min((totalSpent / limit) * 100, 100) : 0;
  const overLimit = totalSpent > limit;

  const payDate = nextPaymentDate(card.paymentDay);
  const days = daysUntil(payDate);

  let barClass = 'bar-fill';
  if (percentUsed >= 100) barClass += ' bar-fill--danger';
  else if (percentUsed >= 75) barClass += ' bar-fill--warning';

  return (
    <div className="summary-wrap">
      <div className="summary-limit-card">
        <div className="summary-limit-top">
          <span className="summary-label">Gastado este mes</span>
          <span className={`summary-spent ${overLimit ? 'summary-spent--over' : ''}`}>
            {formatCurrency(totalSpent)}
          </span>
        </div>
        <div className="bar-track">
          <div className={barClass} style={{ width: `${percentUsed}%` }} />
        </div>
        <div className="summary-limit-bottom">
          <span>{overLimit ? '¡Superaste tu límite!' : `${formatCurrency(available)} disponible`}</span>
          <span>Límite {formatCurrency(limit)}</span>
        </div>
      </div>

      <div className="summary-grid">
        <div className="summary-mini">
          <span className="summary-label">Próximo pago</span>
          <span className="summary-mini-value">
            {payDate ? payDate.toLocaleDateString('es-DO', { day: '2-digit', month: 'short' }) : '—'}
          </span>
          {days !== null && (
            <span className="summary-mini-hint">
              {days === 0 ? 'Es hoy' : days > 0 ? `En ${days} días` : `Hace ${Math.abs(days)} días`}
            </span>
          )}
        </div>

        <div className="summary-mini">
          <span className="summary-label">Día de corte</span>
          <span className="summary-mini-value">{card.cutoffDay ? `Día ${card.cutoffDay}` : '—'}</span>
        </div>
      </div>
    </div>
  );
}
