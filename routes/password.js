import express from 'express';
import User from '../models/User.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

const router = express.Router();

// Configura tu transport de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // o el servicio que uses
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Solicitar reset de contraseña
router.post('/reset', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  // Genera token temporal
  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.resetTokenExpire = Date.now() + 3600000; // 1 hora
  await user.save();

  // Envía email
  const resetUrl = `http://localhost:3000/api/password/reset/${token}`;
  await transporter.sendMail({
    to: email,
    subject: 'Recuperación de contraseña',
    text: `Haz clic en el siguiente enlace para cambiar tu contraseña: ${resetUrl}`,
  });

  res.json({ message: 'Email de recuperación enviado' });
});

// Cambiar contraseña usando el token
router.post('/reset/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const user = await User.findOne({ resetToken: token, resetTokenExpire: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ error: 'Token inválido o expirado' });

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;
  await user.save();

  res.json({ message: 'Contraseña actualizada correctamente' });
});

export default router;
