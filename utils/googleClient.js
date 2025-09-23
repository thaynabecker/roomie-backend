// utils/googleClient.js
import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

export const SCOPES = [
  'openid',
  'profile',
  'email',
  'https://www.googleapis.com/auth/calendar.events'
];

export function createOAuthClient(redirectUri = process.env.GOOGLE_REDIRECT_URI) {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );
}

// Gera URL de login (importantíssimo: offline + prompt=consent)
export function generateAuthUrl() {
  const oAuth2Client = createOAuthClient();
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',   // pede refresh token
    prompt: 'consent',        // força consent para garantir refresh_token
    scope: SCOPES
  });
}
