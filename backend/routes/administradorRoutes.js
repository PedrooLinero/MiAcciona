const express = require('express');
const router = express.Router();
const administradorController = require('../controller/administradorController');

router.get('/admin/:Idadministrador', administradorController.getAdminById);
router.post('/admin/login', administradorController.login);
router.post('/admin/logout', administradorController.logout);
router.get('/admin', administradorController.getAllAdmins);
router.get('/admin/:nif', administradorController.getAdminByNif);
router.put('/admin/:nif', administradorController.updateBiometricAdmin);



module.exports = router;