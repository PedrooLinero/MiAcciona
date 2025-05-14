// routes/tipoAusenciaRoutes.js

const express = require('express');
const router = express.Router();
const tipoAusenciaController = require('../controller/tipoAusenciaController');

// Ruta GET para obtener los tipos de ausencia
router.get('/', tipoAusenciaController.getTiposAusencia);

router.get('/usuarios/:nif/ausencias', tipoAusenciaController.getDiasPorTipo);




module.exports = router;
