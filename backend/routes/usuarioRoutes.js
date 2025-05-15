// routes/usuarioRoutes.js
const express = require("express");
const router = express.Router();
const usuarioController = require("../controller/usuarioController.js");
// Si necesitas verificar el token en algunas rutas, descomenta la siguiente línea
// const { verifyToken, verificarRol } = require("../middlewares/authMiddleware");

// Ruta para login
router.post("/login", usuarioController.login);

// Ruta para logout - Borra la cookie y cierra sesión
router.post("/logout", usuarioController.logout);

// Ruta para obtener todos los usuarios (con verificación de token y rol)
router.get(
  "/usuarios",
  /*verifyToken, verificarRol(["ADMIN"]),*/ usuarioController.getAllUsers
);

// Ruta para obtener un usuario por MIF
// routes/usuarioRoutes.js
router.get("/usuarios/:nif", usuarioController.getUserByNif);

router.put("/usuario/:nif", usuarioController.updateBiometricUser);

router.post("/solicitudes", usuarioController.crearSolicitud);
module.exports = router;
