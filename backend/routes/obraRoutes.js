const express = require('express');
const router = express.Router();
const obraController = require('../controller/obraController');

// Rutas específicas primero:
router.get('/graficaobras', obraController.getGraficaObras);
router.get('/idartista/:idartista', obraController.getObraByArtista);
router.get('/nombre/:nombre', obraController.getObraByNombre);

// Rutas dinámicas después:
router.get('/:idobra', obraController.getObraById);
router.get('/', obraController.getAllObra);
router.post('/', obraController.createObra);
router.put('/:idobra', obraController.updateObra);
router.delete('/:idobra', obraController.deleteObra);

module.exports = router;
