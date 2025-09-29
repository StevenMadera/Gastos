import express from 'express';
import Party from '../models/Party.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Crear party (requiere autenticación)
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log('req.user:', req.user);
    const party = new Party({
      ...req.body,
      user: req.user.id
    });
    await party.save();
    res.status(201).json(party);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener todas las parties del usuario autenticado
router.get('/', authenticateToken, async (req, res) => {
  try {
  const parties = await Party.find({ user: req.user.id });
    res.json(parties);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener party por ID (solo si pertenece al usuario)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
  const party = await Party.findOne({ _id: req.params.id, user: req.user.id });
    if (party) res.json(party);
    else res.status(404).json({ error: 'Party no encontrada' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar party (solo si pertenece al usuario)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    // Custom logic for ticket operations
    const { type, ticketCost } = req.body;
    let party = await Party.findOne({ _id: req.params.id, user: req.user.id });
    if (!party) {
      return res.status(404).json({ error: 'Party no encontrada' });
    }

    if (type === 'add' && ticketCost) {
      party.revenue += ticketCost;
    } else if (type === 'refund' && ticketCost) {
      party.revenue -= ticketCost;
      if (party.revenue < 0) party.revenue = 0;
    } else {
      // Fallback to generic update if not a ticket operation
      Object.assign(party, req.body);
    }
    await party.save();
    res.json(party);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar party (solo si pertenece al usuario)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
  const party = await Party.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (party) res.json({ message: 'Party eliminada' });
    else res.status(404).json({ error: 'Party no encontrada' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
