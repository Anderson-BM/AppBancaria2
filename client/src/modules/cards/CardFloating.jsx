import './CardFloating.css';

// Tarjeta flotante. Si el usuario cargó una imagen, la mostramos flotando;
// si no, generamos una tarjeta con gradiente a partir del color elegido.
export default function CardFloating({ card, onEdit }) {
  if (!card) {
    return (
      <div className="card-floating-empty">
        <p>Agrega tu primera tarjeta para verla aquí, flotando ✨</p>
      </div>
    );
  }

  return (
    <div className="card-floating-stage">
      <div className="card-floating-glow" style={{ background: card.color }} />
      <button className="card-floating" onClick={onEdit} title="Editar tarjeta">
        {card.imageDataUrl ? (
          <img src={card.imageDataUrl} alt={card.name} className="card-floating-img" loading="lazy" />
        ) : (
          <div
            className="card-floating-fallback"
            style={{ background: `linear-gradient(135deg, ${card.color}, #0c1626)` }}
          >
            <span className="card-floating-bank">{card.bank || 'Tarjeta'}</span>
            <span className="card-floating-name">{card.name}</span>
            <span className="card-floating-number">
              •••• •••• •••• {card.last4 || '0000'}
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
