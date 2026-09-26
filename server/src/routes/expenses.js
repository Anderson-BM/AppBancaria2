import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { query } from '../db.js';
import { requireAuth } from '../auth.js';

const router = Router();
router.use(requireAuth);

function toClient(row) {
  return {
    id: row.id,
    cardId: row.card_id,
    date: row.date, // ya viene como texto "YYYY-MM-DD" (ver types.setTypeParser en db.js)
    description: row.description,
    category: row.category,
    amount: Number(row.amount),
  };
}

router.get('/', async (req, res) => {
  const { rows } = await query('SELECT * FROM expenses ORDER BY date DESC, created_at DESC');
  res.json(rows.map(toClient));
});

router.post('/', async (req, res) => {
  const b = req.body || {};
  if (!b.cardId || !b.date || !b.description || !b.amount) {
    return res.status(400).json({ error: 'Faltan datos del gasto.' });
  }
  const id = randomUUID();
  const { rows } = await query(
    `INSERT INTO expenses (id, card_id, date, description, category, amount)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [id, b.cardId, b.date, b.description, b.category || 'Otros', b.amount],
  );
  res.status(201).json(toClient(rows[0]));
});

router.delete('/:id', async (req, res) => {
  await query('DELETE FROM expenses WHERE id = $1', [req.params.id]);
  res.status(204).end();
});

export default router;
