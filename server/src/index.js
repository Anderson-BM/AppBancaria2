import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { runMigrations } from './migrate.js';
import authRoutes from './routes/auth.js';
import cardsRoutes from './routes/cards.js';
import expensesRoutes from './routes/expenses.js';
import fixedExpensesRoutes from './routes/fixedExpenses.js';
import settingsRoutes from './routes/settings.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Las fotos de tarjeta viajan como base64 dentro del JSON, así que subimos
// el límite normal de express.json().
app.use(express.json({ limit: '15mb' }));
app.use(cookieParser());

// Durante desarrollo, cliente (Vite, puerto 5173) y servidor corren en
// puertos distintos, así que hace falta CORS con credenciales. En
// producción todo se sirve desde el mismo origen y esto no molesta.
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }),
);

app.use('/api/auth', authRoutes);
app.use('/api/cards', cardsRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/fixed-expenses', fixedExpensesRoutes);
app.use('/api/settings', settingsRoutes);

// Sirve la app compilada (client/dist, copiada por el Dockerfile a ../client/dist)
const clientDist = path.join(__dirname, '..', '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(clientDist, 'index.html'));
});

const PORT = process.env.PORT || 3000;

runMigrations()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✔ Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('No se pudo preparar la base de datos:', err);
    process.exit(1);
  });
