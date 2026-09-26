import { formatCurrency } from '../../utils/format.js';
import { colorForIndex } from '../../utils/categories.js';
import './PieChart.css';

export default function PieChart({ items }) {
  if (items.length === 0) return null;

  const total = items.reduce((sum, item) => sum + item.amount, 0);
  if (total <= 0) return null;

  let cursor = 0;
  const segments = items.map((item, i) => {
    const start = cursor;
    const fraction = item.amount / total;
    cursor += fraction * 360;
    return { ...item, color: colorForIndex(i), start, end: cursor, fraction };
  });

  const gradient = segments
    .map((s) => `${s.color} ${s.start}deg ${s.end}deg`)
    .join(', ');

  return (
    <div className="pie-wrap">
      <span className="summary-label">Distribución de gastos fijos</span>
      <div className="pie-content">
        <div className="pie-chart" style={{ background: `conic-gradient(${gradient})` }}>
          <div className="pie-hole">
            <span className="pie-hole-value">{formatCurrency(total)}</span>
            <span className="pie-hole-label">total</span>
          </div>
        </div>
        <ul className="pie-legend">
          {segments.map((s) => (
            <li key={s.id ?? s.category} className="pie-legend-item">
              <span className="pie-legend-dot" style={{ background: s.color }} />
              <span className="pie-legend-name">{s.category}</span>
              <span className="pie-legend-pct">{Math.round(s.fraction * 100)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
