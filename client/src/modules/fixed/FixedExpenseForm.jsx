import { useState } from 'react';
import Modal from '../../components/Modal.jsx';
import { CATEGORIES } from '../../utils/categories.js';

const emptyItem = { category: CATEGORIES[0], amount: '', note: '' };

export default function FixedExpenseForm({ initialItem, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(initialItem ? { ...initialItem } : { ...emptyItem });

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.category.trim() || !form.amount) return;
    onSave({ ...form, amount: Number(form.amount) });
  }

  return (
    <Modal title={initialItem ? 'Editar gasto fijo' : 'Nuevo gasto fijo'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="modal-body" style={{ gap: 14 }}>
        <div className="field">
          <label>Categoría</label>
          <input
            list="fixed-categories"
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            placeholder="Casa"
            required
            autoFocus
          />
          <datalist id="fixed-categories">
            {CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        <div className="field-row">
          <div className="field">
            <label>Monto mensual</label>
            <input
              value={form.amount}
              onChange={(e) => update('amount', e.target.value.replace(/[^\d.]/g, ''))}
              placeholder="5000"
              inputMode="decimal"
              required
            />
          </div>
          <div className="field">
            <label>Detalle (opcional)</label>
            <input
              value={form.note}
              onChange={(e) => update('note', e.target.value)}
              placeholder="Departamento"
            />
          </div>
        </div>

        <div className="modal-footer">
          {initialItem && (
            <button type="button" className="btn btn-danger" onClick={() => onDelete(initialItem.id)}>
              Eliminar
            </button>
          )}
          <button type="submit" className="btn btn-primary">Guardar</button>
        </div>
      </form>
    </Modal>
  );
}
