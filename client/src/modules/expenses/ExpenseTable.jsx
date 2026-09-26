import { formatCurrency, formatDate } from '../../utils/format.js';
import './ExpenseTable.css';

export default function ExpenseTable({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="expense-empty">
        <p>Todavía no hay gastos registrados este mes en esta tarjeta.</p>
      </div>
    );
  }

  const sorted = [...expenses].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="expense-table-wrap scroll-x">
      <table className="expense-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th className="col-amount">Monto</th>
            <th className="col-action" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((exp) => (
            <tr key={exp.id}>
              <td>{formatDate(exp.date)}</td>
              <td>{exp.description}</td>
              <td>
                <span className="expense-tag">{exp.category}</span>
              </td>
              <td className="col-amount">{formatCurrency(exp.amount)}</td>
              <td className="col-action">
                <button className="expense-delete" onClick={() => onDelete(exp.id)} aria-label="Eliminar">
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
