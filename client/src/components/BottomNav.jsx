import './BottomNav.css';

export default function BottomNav({ page, onChange }) {
  return (
    <nav className="bottom-nav">
      <button
        className={`bottom-nav-btn ${page === 'cards' ? 'bottom-nav-btn--active' : ''}`}
        onClick={() => onChange('cards')}
      >
        <span className="bottom-nav-icon">💳</span>
        <span>Tarjetas</span>
      </button>
      <button
        className={`bottom-nav-btn ${page === 'fixed' ? 'bottom-nav-btn--active' : ''}`}
        onClick={() => onChange('fixed')}
      >
        <span className="bottom-nav-icon">🧾</span>
        <span>Gastos Fijos</span>
      </button>
    </nav>
  );
}
