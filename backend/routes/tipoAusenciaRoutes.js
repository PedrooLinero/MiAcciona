// routes/tipoAusenciaRoutes.js

const express = require('express');
const router = express.Router();
const tipoAusenciaController = require('../controller/tipoAusenciaController');

// Ruta GET para obtener los tipos de ausencia
router.get('/', tipoAusenciaController.getTiposAusencia);

module.exports = router;
