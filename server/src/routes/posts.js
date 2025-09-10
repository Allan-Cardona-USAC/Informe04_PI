import { Router } from 'express';
import { pool } from '../lib/db.js';
import { authRequired } from '../lib/auth.js';

const router = Router();

// Listar publicaciones con filtros y orden por fecha descendente (la más reciente primero) 
router.get('/', async (req, res) => {
  try {
    const { tipo, curso, instructor, cursoNombre, instructorNombre } = req.query;
    let sql = `SELECT p.*, u.registro_academico, u.nombres, u.apellidos,
                      c.codigo as curso_codigo, c.nombre as curso_nombre,
                      i.nombre as instructor_nombre
               FROM posts p
               JOIN users u ON u.id = p.user_id
               LEFT JOIN courses c ON c.id = p.curso_id
               LEFT JOIN instructors i ON i.id = p.instructor_id
               WHERE 1=1`;
    const params = [];
    if (tipo) { sql += ' AND p.tipo = ?'; params.push(tipo); }
    if (curso) { sql += ' AND c.codigo = ?'; params.push(curso); }
    if (instructor) { sql += ' AND i.nombre LIKE ?'; params.push('%'+instructor+'%'); }
    if (cursoNombre) { sql += ' AND c.nombre LIKE ?'; params.push('%'+cursoNombre+'%'); }
    if (instructorNombre) { sql += ' AND i.nombre LIKE ?'; params.push('%'+instructorNombre+'%'); }
    sql += ' ORDER BY p.created_at DESC';
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Crear publicación
router.post('/', authRequired, async (req, res) => {
  try {
    const { tipo, curso_id, instructor_id, mensaje } = req.body;
    if (!tipo || !mensaje) return res.status(400).json({ message: 'Datos requeridos' });
    const user_id = req.user.id;
    await pool.query('INSERT INTO posts (user_id, tipo, curso_id, instructor_id, mensaje) VALUES (?,?,?,?,?)',
      [user_id, tipo, curso_id || null, instructor_id || null, mensaje]);
    res.json({ message: 'Publicación creada' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Obtener una publicación + comentarios
router.get('/:id', async (req, res) => {
  try {
    const [posts] = await pool.query('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    if (!posts.length) return res.status(404).json({ message: 'No existe' });
    const [comments] = await pool.query(
      `SELECT c.*, u.registro_academico, u.nombres, u.apellidos
       FROM comments c JOIN users u ON u.id=c.user_id
       WHERE c.post_id = ? ORDER BY c.created_at ASC`, [req.params.id]);
    res.json({ post: posts[0], comments });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
