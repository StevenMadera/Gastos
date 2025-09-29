import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Crear usuario
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Obtener usuario por ID
router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) res.json(user);
  else res.status(404).json({ error: 'Usuario no encontrado' });
});

// Actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Usuario eliminado' });
});

export default router;
