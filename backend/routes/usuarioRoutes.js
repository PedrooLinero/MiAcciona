const express = require("express");
const router  = express.Router();
const usuarioController    = require("../controller/usuarioController");
const { verifyToken, verificarRol } = require("../middlewares/authMiddleware");

router.post("/login",  usuarioController.login);
// router.post("/logout", usuarioController.logout);
// router.get("/usuarios", verifyToken, verificarRol(["ADMIN"]), usuarioController.getAllUsers);

module.exports = router;
