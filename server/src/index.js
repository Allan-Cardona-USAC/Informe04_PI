import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './lib/db.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';
import userRoutes from './routes/users.js';
import courseRoutes from './routes/courses.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, ts: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
