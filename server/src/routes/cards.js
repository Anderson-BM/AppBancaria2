import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { query } from '../db.js';
import { requireAuth } from '../auth.js';

const router = Router();
router.use(requireAuth);

function toClient(row) {
  return {
    id: row.id,
    name: row.name,
    bank: row.bank || '',
    last4: row.last4 || '',
    limit: Number(row.card_limit) || 0,
    cutoffDay: row.cutoff_day,
    paymentDay: row.payment_day,
    color: row.color,
    imageDataUrl: row.image_data_url || '',
  };
}

router.get('/', async (req, res) => {
  const { rows } = await query('SELECT * FROM cards ORDER BY created_at ASC');
  res.json(rows.map(toClient));
});

router.post('/', async (req, res) => {
  const b = req.body || {};
  if (!b.name || !b.paymentDay) {
    return res.status(400).json({ error: 'Nombre y día de pago son obligatorios.' });
  }
  const id = randomUUID();
  const { rows } = await query(
    `INSERT INTO cards (id, name, bank, last4, card_limit, cutoff_day, payment_day, color, image_data_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [id, b.name, b.bank || '', b.last4 || '', b.limit || 0, b.cutoffDay || null, b.paymentDay || null, b.color || '#1fb6ad', b.imageDataUrl || ''],
  );
  res.status(201).json(toClient(rows[0]));
});

router.put('/:id', async (req, res) => {
  const b = req.body || {};
  const { rows } = await query(
    `UPDATE cards SET name=$1, bank=$2, last4=$3, card_limit=$4, cutoff_day=$5, payment_day=$6, color=$7, image_data_url=$8
     WHERE id = $9 RETURNING *`,
    [b.name, b.bank || '', b.last4 || '', b.limit || 0, b.cutoffDay || null, b.paymentDay || null, b.color, b.imageDataUrl || '', req.params.id],
  );
  if (!rows[0]) return res.status(404).json({ error: 'Tarjeta no encontrada.' });
  res.json(toClient(rows[0]));
});

router.delete('/:id', async (req, res) => {
  await query('DELETE FROM cards WHERE id = $1', [req.params.id]);
  res.status(204).end();
});

export default router;
