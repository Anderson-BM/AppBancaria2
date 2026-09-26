import { monthLabel, shiftMonth, currentMonthKey } from '../../utils/format.js';
import './MonthSelector.css';

export default function MonthSelector({ monthKey, onChange }) {
  const isCurrent = monthKey === currentMonthKey();

  return (
    <div className="month-selector">
      <button className="month-arrow" onClick={() => onChange(shiftMonth(monthKey, -1))} aria-label="Mes anterior">
        ‹
      </button>
      <div className="month-label">
        <span>{monthLabel(monthKey)}</span>
        {!isCurrent && (
          <button className="month-today" onClick={() => onChange(currentMonthKey())}>
            Ir al mes actual
          </button>
        )}
      </div>
      <button className="month-arrow" onClick={() => onChange(shiftMonth(monthKey, 1))} aria-label="Mes siguiente">
        ›
      </button>
    </div>
  );
}
