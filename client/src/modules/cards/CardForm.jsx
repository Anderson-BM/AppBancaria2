import { useState } from 'react';
import Modal from '../../components/Modal.jsx';
import { processCardImage } from '../../utils/image.js';

const COLOR_PRESETS = ['#1fb6ad', '#f5a623', '#5b7fff', '#e0615a', '#4fcf8f', '#a367e8'];

const emptyCard = {
  name: '',
  bank: '',
  last4: '',
  limit: '',
  paymentDay: '',
  cutoffDay: '',
  color: COLOR_PRESETS[0],
  imageDataUrl: '',
};

export default function CardForm({ initialCard, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(initialCard ? { ...initialCard } : { ...emptyCard });
  const [processingImage, setProcessingImage] = useState(false);
  const [imageError, setImageError] = useState('');

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError('');
    setProcessingImage(true);
    try {
      const dataUrl = await processCardImage(file);
      update('imageDataUrl', dataUrl);
    } catch (err) {
      setImageError('No se pudo procesar esa imagen. Intenta con otra foto.');
    } finally {
      setProcessingImage(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({
      ...form,
      limit: Number(form.limit) || 0,
      paymentDay: Number(form.paymentDay) || null,
      cutoffDay: Number(form.cutoffDay) || null,
    });
  }

  return (
    <Modal title={initialCard ? 'Editar tarjeta' : 'Nueva tarjeta'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="modal-body" style={{ gap: 14 }}>
        <div className="field">
          <label>Imagen de la tarjeta</label>
          <input type="file" accept="image/*" onChange={handleImage} />
          <span className="field-hint">
            Se recorta y ajusta automáticamente en HD para que quede completa, sin desbordarse.
          </span>
          {processingImage && <span className="field-hint">Procesando imagen…</span>}
          {imageError && <span className="field-error">{imageError}</span>}
          {form.imageDataUrl && !processingImage && (
            <img
              src={form.imageDataUrl}
              alt="preview"
              className="card-form-preview"
            />
          )}
        </div>

        <div className="field-row">
          <div className="field">
            <label>Nombre / alias</label>
            <input
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="ISI Visa"
              required
            />
          </div>
          <div className="field">
            <label>Banco</label>
            <input
              value={form.bank}
              onChange={(e) => update('bank', e.target.value)}
              placeholder="Banco Popular"
            />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>Últimos 4 dígitos</label>
            <input
              value={form.last4}
              onChange={(e) => update('last4', e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="1234"
              inputMode="numeric"
            />
          </div>
          <div className="field">
            <label>Límite (no pasarme)</label>
            <input
              value={form.limit}
              onChange={(e) => update('limit', e.target.value.replace(/[^\d.]/g, ''))}
              placeholder="8000"
              inputMode="decimal"
              required
            />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>Día de corte</label>
            <input
              value={form.cutoffDay}
              onChange={(e) => update('cutoffDay', e.target.value.replace(/\D/g, '').slice(0, 2))}
              placeholder="20"
              inputMode="numeric"
            />
          </div>
          <div className="field">
            <label>Día de pago</label>
            <input
              value={form.paymentDay}
              onChange={(e) => update('paymentDay', e.target.value.replace(/\D/g, '').slice(0, 2))}
              placeholder="5"
              inputMode="numeric"
              required
            />
          </div>
        </div>

        <div className="field">
          <label>Color</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {COLOR_PRESETS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => update('color', c)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: c,
                  border: form.color === c ? '2px solid #fff' : '2px solid transparent',
                }}
                aria-label={c}
              />
            ))}
          </div>
        </div>

        <div className="modal-footer">
          {initialCard && (
            <button type="button" className="btn btn-danger" onClick={() => onDelete(initialCard.id)}>
              Eliminar
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            Guardar
          </button>
        </div>
      </form>
    </Modal>
  );
}
