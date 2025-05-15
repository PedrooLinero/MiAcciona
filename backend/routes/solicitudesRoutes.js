// routes/solicitudes.js
const express = require('express');
const router = express.Router();
const { createSolicitud } = require('../controller/solicitudesController');

// Smoke-test opcional
router.post('/test', (req, res) => {
  console.log('👉 LLEGÓ A /api/solicitudes/test', req.body);
  res.json({ ok: true, mensaje: 'Test OK', recibido: req.body });
});

// Ruta real
router.post('/', createSolicitud);

module.exports = router;