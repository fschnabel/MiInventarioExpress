const router = require('express').Router();
const ChatMensaje = require('../models/ChatMensaje');

// últimos 50
router.get('/historial', async (_req, res) => {
  try {
    const items = await ChatMensaje.find().sort({ ts: -1 }).limit(50).lean();
    res.json(items.reverse()); // orden ascendente
  } catch (e) {
    console.error('CHAT historial error:', e);
    res.status(500).json([]);
  }
});

module.exports = router;
