// middleware.js
import jwt from 'jsonwebtoken';
import { pool } from './db.js';

export async function authRequired(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Não autenticado' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await pool.execute('SELECT id, email, role, google_refresh_token FROM users WHERE id = ?', [payload.userId]);
    if (!rows[0]) return res.status(401).json({ error: 'User not found' });
    req.user = rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

export function ensureAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'Apenas admins' });
  next();
}
