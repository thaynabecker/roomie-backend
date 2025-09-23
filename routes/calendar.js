// routes/calendar.js
import express from 'express';
import { google } from 'googleapis';
import { authRequired, ensureAdmin } from '../middleware.js';
import { pool } from '../db.js';
const router = express.Router();

router.post('/api/admins/schedule', authRequired, ensureAdmin, async (req, res) => {
  // body: { title, description, startISO, endISO }
  const { title, description, startISO, endISO } = req.body;
  if (!startISO || !endISO) return res.status(400).json({ error: 'datas obrigatórias' });

  // pega todos os admins pra convidar
  const [admins] = await pool.execute('SELECT email FROM users WHERE role = ?', ['admin']);
  const attendees = admins.map(a => ({ email: a.email }));

  const JITSI_LINK = `https://meet.jit.si/${process.env.JITSI_ROOM_NAME || 'roomie-oficial'}`;

  // Configura OAuth client com refresh_token do usuário que está marcando (req.user.google_refresh_token)
  const oauth2 = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
  oauth2.setCredentials({ refresh_token: req.user.google_refresh_token });

  const calendar = google.calendar({ version: 'v3', auth: oauth2 });

  const event = {
    summary: title || 'Reunião - Roomie (admins)',
    location: JITSI_LINK,
    description: `${description || ''}\n\nLink da reunião: ${JITSI_LINK}`,
    start: { dateTime: startISO, timeZone: 'America/Sao_Paulo' },
    end: { dateTime: endISO, timeZone: 'America/Sao_Paulo' },
    attendees
  };

  try {
    const resp = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      sendUpdates: 'all' // envia convites por e-mail
    });
    return res.json({ ok: true, event: resp.data });
  } catch (err) {
    console.error('Erro create event', err);
    return res.status(500).json({ error: 'Não foi possível criar o evento' });
  }
});

export default router;
