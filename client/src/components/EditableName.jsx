import { useState } from 'react';
import './EditableName.css';

export default function EditableName({ value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function startEdit() {
    setDraft(value);
    setEditing(true);
  }

  function save() {
    const trimmed = draft.trim();
    onChange(trimmed.length > 0 ? trimmed : value);
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        className="editable-name-input"
        value={draft}
        autoFocus
        onFocus={(e) => e.target.select()}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.target.blur();
          if (e.key === 'Escape') setEditing(false);
        }}
      />
    );
  }

  return (
    <button type="button" className="editable-name" onClick={startEdit} title="Editar nombre">
      <span className="editable-name-text">{value}</span>
      <span className="editable-name-pencil">✎</span>
    </button>
  );
}
