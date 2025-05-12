// controllers/UsuarioController.js

const Respuesta = require("../utils/respuesta.js");
const { logMensaje } = require("../utils/logger.js");
const initModels = require("../models/init-models.js").initModels;
const sequelize = require("../config/sequelize.js");
const jwt = require("jsonwebtoken");
const config = require("../config/config.js");

const models = initModels(sequelize);
const Usuario = models.usuarios;

function UsuarioController() {
  /**
   * POST /api/login
   * Body: { nif, password }
   * Aquí usamos nif === password
   */
  this.login = async (req, res) => {
    const { nif, password, huella } = req.body;

    try {
      if (!nif || (!password && !huella)) {
        return res
          .status(400)
          .json(
            Respuesta.error(
              null,
              "El NIF y la contraseña o huella son obligatorios"
            )
          );
      }

      const user = await Usuario.findOne({ where: { nif } });
      if (!user) {
        return res
          .status(401)
          .json(Respuesta.error(null, "Usuario no encontrado"));
      }

      // Login clásico
      if (!huella && password !== user.nif) {
        return res
          .status(401)
          .json(Respuesta.error(null, "Credenciales inválidas"));
      }

      // Si pasó la verificación biométrica o la contraseña coincide, generamos el token
      const token = jwt.sign(
        { sub: user.Idusuario, nif: user.nif, rol: user.rol },
        config.secretKey,
        { expiresIn: "1h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 3600000,
      });

      return res.status(200).json(
        Respuesta.exito(
          {
            id: user.Idusuario,
            nombre: user.nombre,
            primer_apellido: user.primer_apellido,
            rol: user.rol,
          },
          "Inicio de sesión exitoso"
        )
      );
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
      secure: process.env.NODE_ENV === "production",
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
        attributes: ["Idusuario", "nombre", "primer_apellido", "rol", "email"],
      });
      return res.status(200).json(Respuesta.exito(users));
    } catch (err) {
      logMensaje("Error al obtener usuarios: " + err.message, "error");
      return res
        .status(500)
        .json(Respuesta.error(null, "Error al obtener los usuarios"));
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
          "Idusuario",
          "nombre",
          "primer_apellido",
          "segundo_apellido",
          "nif",
          "fechanacimiento",
          "estado",
          "actividad",
          "rol",
          "telefono",
          "email",
          "token_huella",
          "activo_biometria",
          "subdivision_personal",
          "diasPermitidos",
        ],
      });
      if (!user) {
        return res
          .status(404)
          .json(Respuesta.error(null, "Usuario no encontrado"));
      }
      return res.status(200).json(Respuesta.exito(user));
    } catch (err) {
      logMensaje("Error al obtener usuario por NIF: " + err.message, "error");
      return res
        .status(500)
        .json(Respuesta.error(null, "Error interno del servidor"));
    }
  };

  this.updateBiometricUser = async (req, res) => {
    const datos = req.body;
    const { nif } = req.params;

    console.log("Solicitud PUT recibida en /usuario/:nif");
    console.log(datos.activo);

    try {
      const numFilas = await Usuario.update(
        { ...datos, activo_biometria: datos.activo },
        { where: { nif } }
      );

      res.status(204).send();
    } catch (error) {
      logMensaje("Error :" + error);
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al actualizar los datos: ${req.originalUrl}`
          )
        );
    }
  };
}

module.exports = new UsuarioController();
