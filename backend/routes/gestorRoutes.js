const express = require('express');
const router = express.Router();
const gestorController = require('../controller/gestorController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/gestor/:Idgestor', gestorController.getgestorById);
router.post('/gestor/login', gestorController.login);
router.post('/gestor/logout', gestorController.logout);
router.get('/gestor', gestorController.getAllgestors);
router.get('/gestor/:nif', gestorController.getgestorByNif);
router.put('/gestor/:nif', gestorController.updateBiometricgestor);
router.get('/gestor/solicitudes/:Idgestor', gestorController.getSolicitudes);

module.exports = router;