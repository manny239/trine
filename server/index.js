import express from 'express';
import cors from 'cors';
import menuRoutes from './routes/menu.routes.js';
import orderRoutes from './routes/order.routes.js';

const PORT = process.env.PORT || 4000;
/** Artificial latency so frontend loading states are visible in development. */
const API_DELAY_MS = Number(process.env.API_DELAY_MS ?? 300);

const app = express();

app.use(cors());
app.use(express.json());

// Simulated network latency, applied to the API surface only.
app.use('/api', (req, res, next) => {
  if (API_DELAY_MS <= 0) return next();
  setTimeout(next, API_DELAY_MS);
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api', menuRoutes);
app.use('/api', orderRoutes);

// JSON 404 for anything else under /api.
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Malformed JSON bodies and any other unhandled error stay JSON too.
app.use((err, req, res, next) => {
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body must be valid JSON' });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Trine API listening on http://localhost:${PORT}`);
});
