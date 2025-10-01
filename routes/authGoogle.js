import 'dotenv/config'; // garante que o .env seja carregado
import express from 'express';
import { google } from 'googleapis';
import { pool } from '../db.js';

const router = express.Router();

// OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI_LOGIN
);

// === 1️⃣ Rota para iniciar login Google ===
router.get('/auth/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ],
    prompt: 'consent'
  });

  console.log('[DEBUG] URL gerada:', url);
  res.redirect(url);
});

// === 2️⃣ Callback do Google ===
router.get('/auth/google/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('No code returned from Google');

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    // Salva refresh token no banco se existir
    if (tokens.refresh_token) {
      await pool.execute(
        'UPDATE users SET google_refresh_token = ? WHERE email = ?',
        [tokens.refresh_token, data.email]
      );
      console.log('[GOOGLE LOGIN] Refresh token salvo para', data.email);
    }

    // Redireciona pro frontend com email
    const redirectURL = `http://localhost:5173/inicio?login=success&email=${encodeURIComponent(data.email)}`;
    res.redirect(redirectURL);

  } catch (err) {
    console.error('[GOOGLE LOGIN ERROR]', err);
    res.status(500).send('Erro no login com Google');
  }
});

export default router;
