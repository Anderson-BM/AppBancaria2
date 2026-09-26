import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { issueSession, clearSession, isAuthenticated } from '../auth.js';

const router = Router();

router.get('/status', async (req, res) => {
  const { rows } = await query('SELECT pin_hash FROM settings WHERE id = 1');
  const hasPin = Boolean(rows[0]?.pin_hash);
  res.json({ hasPin, authenticated: isAuthenticated(req) });
});

router.post('/setup', async (req, res) => {
  const { pin } = req.body || {};
  if (!pin || String(pin).length < 4) {
    return res.status(400).json({ error: 'El PIN debe tener al menos 4 dígitos.' });
  }

  const { rows } = await query('SELECT pin_hash FROM settings WHERE id = 1');
  if (rows[0]?.pin_hash) {
    return res.status(409).json({ error: 'Ya existe un PIN configurado. Usa /login.' });
  }

  const hash = await bcrypt.hash(String(pin), 10);
  await query('UPDATE settings SET pin_hash = $1 WHERE id = 1', [hash]);
  issueSession(res);
  res.json({ ok: true });
});

router.post('/login', async (req, res) => {
  const { pin } = req.body || {};
  const { rows } = await query('SELECT pin_hash FROM settings WHERE id = 1');
  const hash = rows[0]?.pin_hash;

  if (!hash) {
    return res.status(409).json({ error: 'Todavía no hay un PIN configurado.' });
  }

  const valid = await bcrypt.compare(String(pin || ''), hash);
  if (!valid) {
    return res.status(401).json({ error: 'PIN incorrecto.' });
  }

  issueSession(res);
  res.json({ ok: true });
});

router.post('/logout', (req, res) => {
  clearSession(res);
  res.json({ ok: true });
});

export default router;
