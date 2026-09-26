import { formatCurrency } from '../../utils/format.js';
import './FixedExpensesTable.css';

export default function FixedExpensesTable({ items, onEdit }) {
  if (items.length === 0) {
    return (
      <div className="expense-empty">
        <p>Todavía no registras gastos fijos. Agrega renta, servicios, suscripciones, etc.</p>
      </div>
    );
  }

  return (
    <div className="expense-table-wrap scroll-x">
      <table className="expense-table">
        <thead>
          <tr>
            <th>Categoría</th>
            <th>Detalle</th>
            <th className="col-amount">Monto</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="fixed-row" onClick={() => onEdit(item)}>
              <td>
                <span className="expense-tag">{item.category}</span>
              </td>
              <td>{item.note || '—'}</td>
              <td className="col-amount">{formatCurrency(item.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
