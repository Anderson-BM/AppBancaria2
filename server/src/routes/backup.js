import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const [cards, expenses, fixedExpenses, settings] = await Promise.all([
    query('SELECT * FROM cards ORDER BY created_at ASC'),
    query('SELECT * FROM expenses ORDER BY date ASC'),
    query('SELECT * FROM fixed_expenses ORDER BY created_at ASC'),
    query('SELECT display_name, theme, fixed_limit FROM settings WHERE id = 1'),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    settings: settings.rows[0],
    cards: cards.rows,
    expenses: expenses.rows,
    fixedExpenses: fixedExpenses.rows,
  };

  res.setHeader('Content-Disposition', `attachment; filename="mis-tarjetas-backup-${new Date().toISOString().slice(0, 10)}.json"`);
  res.json(payload);
});

export default router;
