import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { query } from '../db.js';
import { requireAuth } from '../auth.js';

const router = Router();
router.use(requireAuth);

function toClient(row) {
  return {
    id: row.id,
    category: row.category,
    amount: Number(row.amount),
    note: row.note || '',
  };
}

router.get('/', async (req, res) => {
  const { rows } = await query('SELECT * FROM fixed_expenses ORDER BY created_at ASC');
  res.json(rows.map(toClient));
});

router.post('/', async (req, res) => {
  const b = req.body || {};
  if (!b.category || !b.amount) {
    return res.status(400).json({ error: 'Categoría y monto son obligatorios.' });
  }
  const id = randomUUID();
  const { rows } = await query(
    `INSERT INTO fixed_expenses (id, category, amount, note) VALUES ($1,$2,$3,$4) RETURNING *`,
    [id, b.category, b.amount, b.note || ''],
  );
  res.status(201).json(toClient(rows[0]));
});

router.put('/:id', async (req, res) => {
  const b = req.body || {};
  const { rows } = await query(
    `UPDATE fixed_expenses SET category=$1, amount=$2, note=$3 WHERE id=$4 RETURNING *`,
    [b.category, b.amount, b.note || '', req.params.id],
  );
  if (!rows[0]) return res.status(404).json({ error: 'No encontrado.' });
  res.json(toClient(rows[0]));
});

router.delete('/:id', async (req, res) => {
  await query('DELETE FROM fixed_expenses WHERE id = $1', [req.params.id]);
  res.status(204).end();
});

export default router;
