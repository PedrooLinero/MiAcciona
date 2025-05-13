const express = require('express');
const router = express.Router();
const administradorController = require('../controller/administradorController');

router.post('/admin/login', administradorController.login);
router.post('/admin/logout', administradorController.logout);
router.get('/administradores', administradorController.getAllAdmins);
router.get('/administradores/:nif', administradorController.getAdminByNif);
router.put('/administradores/:nif', administradorController.updateBiometricAdmin);

module.exports = router;