import { formatCurrency } from '../../utils/format.js';
import './CategoryBreakdown.css';

export default function CategoryBreakdown({ expenses }) {
  if (expenses.length === 0) return null;

  const totals = {};
  for (const exp of expenses) {
    totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
  }

  const rows = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...rows.map((r) => r[1]));

  return (
    <div className="category-breakdown">
      <span className="summary-label">Por categoría</span>
      <div className="category-rows">
        {rows.map(([category, amount]) => (
          <div className="category-row" key={category}>
            <span className="category-name">{category}</span>
            <div className="category-track">
              <div className="category-fill" style={{ width: `${(amount / max) * 100}%` }} />
            </div>
            <span className="category-amount">{formatCurrency(amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
