import './CardSelector.css';

export default function CardSelector({ cards, activeCardId, onSelect, onAdd }) {
  return (
    <div className="card-selector scroll-x">
      {cards.map((card) => (
        <button
          key={card.id}
          className={`card-chip ${card.id === activeCardId ? 'card-chip--active' : ''}`}
          onClick={() => onSelect(card.id)}
          style={{ '--chip-color': card.color }}
        >
          {card.imageDataUrl ? (
            <img src={card.imageDataUrl} alt={card.name} className="card-chip-img" />
          ) : (
            <span className="card-chip-dot" style={{ background: card.color }} />
          )}
          <span className="card-chip-label">{card.name}</span>
        </button>
      ))}

      <button className="card-chip card-chip--add" onClick={onAdd}>
        <span className="card-chip-plus">+</span>
        <span className="card-chip-label">Agregar</span>
      </button>
    </div>
  );
}
