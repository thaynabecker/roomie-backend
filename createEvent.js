// createEvent.js
import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const args = Object.fromEntries(process.argv.slice(2).map(s => s.split('=')));

const refreshToken = process.env.REFRESH_TOKEN_CALENDAR;
if (!refreshToken) {
  console.error('❌ REFRESH_TOKEN_CALENDAR não encontrado no .env');
  process.exit(1);
}

const startISO = args.start || new Date(Date.now() + 1000 * 60 * 5).toISOString();
const endISO = args.end || new Date(Date.now() + 1000 * 60 * 65).toISOString();
const title = args.title || 'Teste Roomie';
const attendees = (args.attendees || '').split(',').filter(Boolean).map(e => ({ email: e }));

async function run() {
  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID_CALENDAR,
    process.env.GOOGLE_CLIENT_SECRET_CALENDAR
  );
  oauth2.setCredentials({ refresh_token: refreshToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2 });
  const JITSI_LINK = `https://meet.jit.si/${process.env.JITSI_ROOM_NAME || 'roomie-oficial'}`;

  const event = {
    summary: title,
    location: JITSI_LINK,
    description: `Evento via script\n\nLink do Jitsi: ${JITSI_LINK}`,
    start: { dateTime: startISO, timeZone: 'America/Sao_Paulo' },
    end: { dateTime: endISO, timeZone: 'America/Sao_Paulo' },
    attendees,
    guestsCanInviteOthers: true,
    guestsCanModify: true
  };

  try {
    const resp = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      sendUpdates: 'all' // força envio do convite
    });
    console.log('✅ Evento criado:', resp.data.htmlLink);
  } catch (err) {
    console.error('❌ Erro:', err?.response?.data || err);
  }
}

run();
