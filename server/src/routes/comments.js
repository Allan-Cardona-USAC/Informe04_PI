import { Router } from 'express';
import { pool } from '../lib/db.js';
import { authRequired } from '../lib/auth.js';

const router = Router();

router.post('/', authRequired, async (req, res) => {
  try {
    const { post_id, mensaje } = req.body;
    if (!post_id || !mensaje) return res.status(400).json({ message: 'Datos requeridos' });
    await pool.query('INSERT INTO comments (post_id, user_id, mensaje) VALUES (?,?,?)', [post_id, req.user.id, mensaje]);
    res.json({ message: 'Comentario agregado' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
