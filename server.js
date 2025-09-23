// server.js
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authGoogle.js';
import calendarRoutes from './routes/calendar.js';
import cors from 'cors';

dotenv.config();
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use(authRoutes);
app.use(calendarRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server on', PORT));
