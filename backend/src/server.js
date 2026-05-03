'use strict';
require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');

const connectMongo = require('./db/mongo');
const connectRedis = require('./db/redis');

const authRoutes    = require('./routes/auth');
const courseRoutes  = require('./routes/courses');
const userRoutes    = require('./routes/users');

const app  = express();
const PORT = process.env.PORT || 4000;

// ── Security & utility middleware ─────────────────────────────
app.use(helmet());
app.use(cors({
  origin: (process.env.CORS_ORIGIN || '').split(','),
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));

// Global rate limit
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Слишком много запросов. Попробуйте позже.' }
}));

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',    authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users',   userRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'ok', ts: Date.now() }));

// 404
app.use((_, res) => res.status(404).json({ error: 'Route not found' }));

// Error handler
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
});

// ── Boot ──────────────────────────────────────────────────────
(async () => {
  await connectMongo();
  await connectRedis();
  app.listen(PORT, () => console.log(`[SkillPath API] Listening on :${PORT}`));
})();
