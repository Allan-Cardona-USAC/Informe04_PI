import { Router } from 'express';
import { pool } from '../lib/db.js';
const router = Router();

router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM courses ORDER BY codigo');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
