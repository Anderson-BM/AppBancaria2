import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const { rows } = await query(
    'SELECT display_name, theme, fixed_limit FROM settings WHERE id = 1',
  );
  const s = rows[0] || {};
  res.json({
    displayName: s.display_name || 'Sr. Anderson BM',
    theme: s.theme || 'dark',
    fixedLimit: Number(s.fixed_limit) || 10000,
  });
});

router.put('/', async (req, res) => {
  const b = req.body || {};
  const fields = [];
  const values = [];
  let i = 1;

  if (b.displayName !== undefined) {
    fields.push(`display_name = $${i++}`);
    values.push(b.displayName);
  }
  if (b.theme !== undefined) {
    fields.push(`theme = $${i++}`);
    values.push(b.theme);
  }
  if (b.fixedLimit !== undefined) {
    fields.push(`fixed_limit = $${i++}`);
    values.push(b.fixedLimit);
  }
  if (fields.length === 0) return res.json({ ok: true });

  await query(`UPDATE settings SET ${fields.join(', ')} WHERE id = 1`, values);
  res.json({ ok: true });
});

export default router;
