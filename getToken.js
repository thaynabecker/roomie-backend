import { google } from 'googleapis';
import readline from 'readline';
import dotenv from 'dotenv';
dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline', // isso garante que vem refresh_token
  prompt: 'consent',      // força pedir permissão
  scope: SCOPES,
});

console.log('Abra este link no navegador e faça login:\n', authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('\nCole aqui o código que aparece na URL depois de "code=": ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code.trim());
    console.log('\n✅ Tokens recebidos:');
    console.log(tokens);
    console.log('\nCopie o "refresh_token" inteiro e cole no seu .env como REFRESH_TOKEN');
  } catch (err) {
    console.error('Erro ao trocar código por tokens:', err);
  }
  rl.close();
});
