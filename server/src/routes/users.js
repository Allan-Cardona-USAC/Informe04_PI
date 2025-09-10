import { Router } from 'express';
import { pool } from '../lib/db.js';
import { authRequired } from '../lib/auth.js';

const router = Router();

// Ver perfil por registro académico
router.get('/profile/:registro', async (req, res) => {
  try {
    const { registro } = req.params;
    const [rows] = await pool.query('SELECT id, registro_academico, nombres, apellidos, email FROM users WHERE registro_academico = ?', [registro]);
    if (!rows.length) return res.status(404).json({ message: 'No existe' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Ver mi perfil
router.get('/me', authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, registro_academico, nombres, apellidos, email FROM users WHERE id = ?', [req.user.id]);
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Actualizar mi perfil (no RA)
router.put('/me', authRequired, async (req, res) => {
  try {
    const { nombres, apellidos, email } = req.body;
    await pool.query('UPDATE users SET nombres=?, apellidos=?, email=? WHERE id=?', [nombres, apellidos, email, req.user.id]);
    res.json({ message: 'Perfil actualizado' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Cursos aprobados
router.get('/approved', async (req, res) => {
  try {
    const registro = req.query.registro;
    if (!registro) return res.status(400).json({ message: 'registro requerido' });
    const [u] = await pool.query('SELECT id FROM users WHERE registro_academico=?', [registro]);
    if (!u.length) return res.status(404).json({ message: 'Usuario no existe' });
    const userId = u[0].id;
    const [rows] = await pool.query(
      `SELECT ac.id, c.codigo, c.nombre, ac.created_at
       FROM approved_courses ac JOIN courses c ON c.id = ac.course_id
       WHERE ac.user_id = ? ORDER BY c.codigo`, [userId]);
    const [{0: tot}] = await pool.query('SELECT SUM(4) as creditos FROM approved_courses WHERE user_id = ?', [userId]);
    res.json({ items: rows, total_creditos: (tot && tot["creditos"]) || 0 });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/approved', authRequired, async (req, res) => {
  try {
    const { course_id } = req.body;
    if (!course_id) return res.status(400).json({ message: 'course_id requerido' });
    await pool.query('INSERT IGNORE INTO approved_courses (user_id, course_id) VALUES (?,?)', [req.user.id, course_id]);
    res.json({ message: 'Curso agregado' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
