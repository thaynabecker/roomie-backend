// backend/server.js
import dotenv from 'dotenv';
dotenv.config({ override: true }); // ⬅ precisa vir antes de qualquer import que use process.env

import express from 'express';
import cors from 'cors';
import session from 'express-session';
import authGoogleRouter from './routes/authGoogle.js';

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use(session({
  secret: process.env.JWT_SECRET || 'roomie',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Rotas
app.use(authGoogleRouter);

// Teste rápido
app.get('/teste', (req, res) => res.send('Backend rodando!'));

// Ouvir porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));