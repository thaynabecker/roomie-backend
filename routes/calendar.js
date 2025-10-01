// routes/calendar.js
import express from 'express';
import { google } from 'googleapis';
import { authRequired, ensureAdmin } from '../middleware.js';

const router = express.Router();

const ADMIN_EMAILS = [
  'juliacostaifc@gmail.com',
  'costadsjulia@gmail.com',
  'thaynabecker.ifcaraquari@gmail.com',
  'amandaeduarda.ifc.araquari@gmail.com',
  'annaluizaaraujo.ifcaraquari@gmail.com',
  'luizawestruppdocarmo@gmail.com'
];

router.post('/api/admins/schedule', authRequired, ensureAdmin, async (req, res) => {
  console.log('[SCHEDULE] request by user:', req.user?.id, req.user?.email);
  console.log('[SCHEDULE] body:', req.body);

  const { title, description, startISO, endISO } = req.body;
  if (!startISO || !endISO) {
    return res.status(400).json({ error: 'datas obrigatórias' });
  }
  if (new Date(startISO) >= new Date(endISO)) {
    return res.status(400).json({ error: 'start deve ser antes do end' });
  }

  // checagem importante: o user precisa ter refresh token salvo
  if (!req.user?.google_refresh_token) {
    console.error('[SCHEDULE] user sem google_refresh_token:', req.user?.email);
    return res.status(400).json({ error: 'Usuário não possui google_refresh_token. Refaça autenticação Google.' });
  }

  const attendees = ADMIN_EMAILS.map(email => ({ email }));
  const JITSI_LINK = `https://meet.jit.si/${process.env.JITSI_ROOM_NAME || 'roomie-oficial'}`;

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
      sendUpdates: 'all'
    });
    console.log('[SCHEDULE] evento criado ->', resp.data.id);
    return res.json({ ok: true, event: resp.data });
  } catch (err) {
    console.error('[SCHEDULE] erro create event ->', err);
    if (err?.response?.data) console.error('[SCHEDULE] google api response ->', err.response.data);
    // Em dev podemos enviar detalhes; em prod remova `details`
    return res.status(500).json({ error: 'Não foi possível criar o evento', details: err.message });
  }
});

export default router;
