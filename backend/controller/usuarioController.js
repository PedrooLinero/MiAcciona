// controllers/UsuarioController.js

const Respuesta      = require("../utils/respuesta.js");
const { logMensaje } = require("../utils/logger.js");
const initModels     = require("../models/init-models.js").initModels;
const sequelize      = require("../config/sequelize.js");
const jwt            = require("jsonwebtoken");
const config         = require("../config/config.js");

const models  = initModels(sequelize);
const Usuario = models.usuarios;

function UsuarioController() {
  /**
   * POST /api/login
   * Body: { nif, password }
   * Aquí usamos nif === password
   */
  this.login = async (req, res) => {
    const { nif, password } = req.body;
    try {
      if (!nif || !password) {
        return res
          .status(400)
          .json(Respuesta.error(null, "El NIF y la contraseña son obligatorios"));
      }
      const user = await Usuario.findOne({ where: { nif } });
      if (!user) {
        return res
          .status(401)
          .json(Respuesta.error(null, "Usuario no encontrado"));
      }
      if (password !== user.nif) {
        return res
          .status(401)
          .json(Respuesta.error(null, "Credenciales inválidas"));
      }
      const token = jwt.sign(
        { sub: user.Idusuario, nif: user.nif, rol: user.rol },
        config.secretKey,
        { expiresIn: "1h" }
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 3600000
      });
      const salida = {
        id: user.Idusuario,
        nombre: user.nombre,
        primer_apellido: user.primer_apellido,
        rol: user.rol
      };
      return res
        .status(200)
        .json(Respuesta.exito(salida, "Inicio de sesión exitoso"));
    } catch (err) {
      logMensaje("Error en login: " + err.message, "error");
      return res
        .status(500)
        .json(Respuesta.error(null, "Error interno del servidor"));
    }
  };

  /**
   * POST /api/logout
   * Borra la cookie de autenticación
   */
  this.logout = (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    });
    return res
      .status(200)
      .json(Respuesta.exito(null, "Cierre de sesión exitoso"));
  };

  /**
   * GET /api/usuarios
   * Devuelve todos los usuarios
   */
  this.getAllUsers = async (req, res) => {
    try {
      const users = await Usuario.findAll({
        attributes: ["Idusuario", "nombre", "primer_apellido", "rol", "email"]
      });
      return res.status(200).json(Respuesta.exito(users));
    } catch (err) {
      logMensaje("Error al obtener usuarios: " + err.message, "error");
      return res.status(500).json(Respuesta.error(null, "Error al obtener los usuarios"));
    }
  };

  /**
   * GET /api/usuarios/:nif
   * Recupera un usuario por su NIF
   */
  this.getUserByNif = async (req, res) => {
    const { nif } = req.params;
    try {
      if (!nif) {
        return res
          .status(400)
          .json(Respuesta.error(null, "El NIF es obligatorio"));
      }
      const user = await Usuario.findOne({
        where: { nif },
        attributes: [
          "Idusuario", "nombre", "primer_apellido", "segundo_apellido",
          "nif", "fechanacimiento", "estado", "actividad", "rol",
          "telefono", "email", "subdivision_personal", "diasPermitidos"
        ]
      });
      if (!user) {
        return res
          .status(404)
          .json(Respuesta.error(null, "Usuario no encontrado"));
      }
      return res.status(200).json(Respuesta.exito(user));
    } catch (err) {
      logMensaje("Error al obtener usuario por NIF: " + err.message, "error");
      return res.status(500).json(Respuesta.error(null, "Error interno del servidor"));
    }
  };
}

module.exports = new UsuarioController();
