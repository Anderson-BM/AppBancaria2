import { useState } from 'react';
import Modal from '../../components/Modal.jsx';
import { CATEGORIES } from '../../utils/categories.js';function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function ExpenseForm({ cardName, onSave, onClose }) {
  const [form, setForm] = useState({
    date: todayIso(),
    description: '',
    category: CATEGORIES[0],
    amount: '',
  });

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.description.trim() || !form.amount) return;
    onSave({ ...form, amount: Number(form.amount) });
  }

  return (
    <Modal title={`Nuevo gasto · ${cardName}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="modal-body" style={{ gap: 14 }}>
        <div className="field">
          <label>Fecha</label>
          <input type="date" value={form.date} onChange={(e) => update('date', e.target.value)} required />
        </div>

        <div className="field">
          <label>Descripción</label>
          <input
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Tenis Pull&Bear"
            required
            autoFocus
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label>Categoría</label>
            <select value={form.category} onChange={(e) => update('category', e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Monto</label>
            <input
              value={form.amount}
              onChange={(e) => update('amount', e.target.value.replace(/[^\d.]/g, ''))}
              placeholder="1000"
              inputMode="decimal"
              required
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="submit" className="btn btn-primary">Guardar gasto</button>
        </div>
      </form>
    </Modal>
  );
}
