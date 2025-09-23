import express from 'express';
import { google } from 'googleapis';
const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Redireciona pro Google
router.get('/auth/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
    prompt: 'consent'
  });
  res.redirect(url);
});

// Callback do Google
router.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    res.send(`Login feito! Tokens: <pre>${JSON.stringify(tokens, null, 2)}</pre>`);
  } catch (err) {
    console.error(err);
    res.send('Erro no login com Google');
  }
});

export default router;
