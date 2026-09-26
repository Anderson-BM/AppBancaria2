import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'cambia-esto-en-produccion-por-favor';
const COOKIE_NAME = 'mt_session';

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  No se definió JWT_SECRET. Usa uno propio y secreto en producción (variable de entorno).');
}

export function issueSession(res) {
  const token = jwt.sign({ ok: true }, SECRET, { expiresIn: '30d' });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

export function clearSession(res) {
  res.clearCookie(COOKIE_NAME);
}

export function isAuthenticated(req) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return false;
  try {
    jwt.verify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

export function requireAuth(req, res, next) {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'No autenticado.' });
  }
  next();
}
