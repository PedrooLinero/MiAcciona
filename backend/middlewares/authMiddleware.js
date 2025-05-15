// src/middleware/auth.js
const jwt = require("jsonwebtoken");
const { logMensaje } = require("../utils/logger.js");
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});
const config = require("../config/config.js");

/**
 * Middleware que verifica el token JWT enviado en el encabezado Authorization.
 * Formato esperado: "Authorization: Bearer <token>"
 */
function verifyToken(req, res, next) {
  // 1. Buscar token en cookies primero
  const tokenCookie = req.cookies.token;

  // 2. Si no está en cookies, buscar en headers
  const tokenHeader = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;

  const token = tokenCookie || tokenHeader;

  if (!token) {
    return res.status(401).json({
      ok: false,
      datos: null,
      mensaje: "Token no proporcionado o formato inválido",
    });
  }

  try {
    const decoded = jwt.verify(token, config.secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    logMensaje(`Error al verificar token: ${err.message}`, "error");
    return res.status(403).json({
      ok: false,
      datos: null,
      mensaje: "Token inválido o expirado",
    });
  }
}

/**
 * Middleware que comprueba si el usuario autenticado tiene uno de los roles permitidos.
 * @param {string[]} rolesPermitidos - Array de roles (propiedad "rol" en payload) que pueden acceder
 */
function verificarRol(rolesPermitidos = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        ok: false,
        datos: null,
        mensaje: "No autorizado",
      });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        ok: false,
        datos: null,
        mensaje: "Acceso denegado. Permisos insuficientes",
      });
    }

    next();
  };
}

module.exports = { verifyToken, verificarRol };
