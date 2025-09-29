import express from 'express';
import Party from '../models/Party.js';

const router = express.Router();

// Crear party
router.post('/', async (req, res) => {
  try {
    const party = new Party(req.body);
    await party.save();
    res.status(201).json(party);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener todas las parties
router.get('/', async (req, res) => {
  const parties = await Party.find();
  res.json(parties);
});

// Obtener party por ID
router.get('/:id', async (req, res) => {
  const party = await Party.findById(req.params.id);
  if (party) res.json(party);
  else res.status(404).json({ error: 'Party no encontrada' });
});

// Actualizar party
router.put('/:id', async (req, res) => {
  try {
    const party = await Party.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(party);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar party
router.delete('/:id', async (req, res) => {
  await Party.findByIdAndDelete(req.params.id);
  res.json({ message: 'Party eliminada' });
});

export default router;
