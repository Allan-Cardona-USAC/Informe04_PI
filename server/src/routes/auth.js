import { Router } from 'express';
import { pool } from '../lib/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { registro_academico, nombres, apellidos, email, password } = req.body;
    if (!registro_academico || !nombres || !apellidos || !email || !password) {
      return res.status(400).json({ message: 'Datos requeridos' });
    }
    const [exists] = await pool.query('SELECT id FROM users WHERE email = ? OR registro_academico = ?', [email, registro_academico]);
    if (exists.length) return res.status(409).json({ message: 'Usuario ya existe' });
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (registro_academico, nombres, apellidos, email, password_hash) VALUES (?,?,?,?,?)',
      [registro_academico, nombres, apellidos, email, hash]
    );
    return res.json({ message: 'Registrado' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ message: 'Credenciales inválidas' });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' });
    const token = jwt.sign({ id: user.id, ra: user.registro_academico, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// "Olvidó contraseña": crea un token y lo imprime en consola (modo demo)
router.post('/forgot', async (req, res) => {
  try {
    const { registro_academico, email } = req.body;
    const [rows] = await pool.query('SELECT id FROM users WHERE registro_academico = ? AND email = ?', [registro_academico, email]);
    if (!rows.length) return res.status(404).json({ message: 'Datos no coinciden' });
    const userId = rows[0].id;
    const token = Math.random().toString(36).slice(2);
    const expires = new Date(Date.now() + 1000*60*30); // 30 min
    await pool.query('INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?,?,?)', [userId, token, expires]);
    console.log('[RESET TOKEN]', { email, token });
    res.json({ message: 'Se envió un token (consola del servidor en modo demo)' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/reset', async (req, res) => {
  try {
    const { token, new_password } = req.body;
    const [rows] = await pool.query('SELECT * FROM password_reset_tokens WHERE token = ? AND used = 0 AND expires_at > NOW()', [token]);
    if (!rows.length) return res.status(400).json({ message: 'Token inválido o expirado' });
    const pr = rows[0];
    const hash = await bcrypt.hash(new_password, 10);
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, pr.user_id]);
    await pool.query('UPDATE password_reset_tokens SET used = 1 WHERE id = ?', [pr.id]);
    res.json({ message: 'Contraseña actualizada' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
