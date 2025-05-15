const Respuesta = require("../utils/respuesta.js");
const { logMensaje } = require("../utils/logger.js");
const initModels = require("../models/init-models.js").initModels;
const sequelize = require("../config/sequelize.js");
const jwt = require("jsonwebtoken");
const config = require("../config/config.js");

const models = initModels(sequelize);
const Administrador = models.administrador;

function administradorController() {
  /**
   * POST /api/admin/login
   * Body: { nif, password }
   * Usamos nif === password para autenticación clásica
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

      const admin = await Administrador.findOne({ where: { nif } });
      if (!admin) {
        return res
          .status(401)
          .json(Respuesta.error(null, "Administrador no encontrado"));
      }

      // Login clásico
      if (!huella && password !== admin.nif) {
        return res
          .status(401)
          .json(Respuesta.error(null, "Credenciales inválidas"));
      }

      // Generar token JWT
      const token = jwt.sign(
        { sub: admin.Idadministrador, nif: admin.nif, rol: admin.rol },
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
            id: admin.Idadministrador,
            nombre: admin.nombre,
            primer_apellido: admin.primer_apellido,
            rol: admin.rol,
          },
          "Inicio de sesión exitoso"
        )
      );
    } catch (err) {
      logMensaje("Error en login de administrador: " + err.message, "error");
      return res
        .status(500)
        .json(Respuesta.error(null, "Error interno del servidor"));
    }
  };

  /**
   * POST /api/admin/logout
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
   * GET /api/administradores
   * Devuelve todos los administradores
   */
  this.getAllAdmins = async (req, res) => {
    try {
      const admins = await Administrador.findAll({
        attributes: [
          "Idadministrador",
          "nombre",
          "primer_apellido",
          "rol",
          "email",
        ],
      });
      return res.status(200).json(Respuesta.exito(admins));
    } catch (err) {
      logMensaje("Error al obtener administradores: " + err.message, "error");
      return res
        .status(500)
        .json(Respuesta.error(null, "Error al obtener los administradores"));
    }
  };

  /**
   * GET /api/administradores/:nif
   * Recupera un administrador por su NIF
   */
  this.getAdminByNif = async (req, res) => {
    const { nif } = req.params;
    try {
      if (!nif) {
        return res
          .status(400)
          .json(Respuesta.error(null, "El NIF es obligatorio"));
      }
      const admin = await Administrador.findOne({
        where: { nif },
        attributes: [
          "Idadministrador",
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
        ],
        include: [
          {
            model: models.usuarios,
            as: "usuarios",
            attributes: [
              "Idusuario",
              "nombre",
              "primer_apellido",
              "nif",
              "rol",
            ],
          },
        ],
      });
      if (!admin) {
        return res
          .status(404)
          .json(Respuesta.error(null, "Administrador no encontrado"));
      }

      // Transformar los datos para un formato más amigable
      const adminData = {
        ...admin.get({ plain: true }),
      };

      return res.status(200).json(Respuesta.exito(adminData));
    } catch (err) {
      logMensaje(
        "Error al obtener administrador por NIF: " + err.message,
        "error"
      );
      return res
        .status(500)
        .json(Respuesta.error(null, "Error interno del servidor"));
    }
  };

  /**
   * PUT /api/administradores/:nif
   * Actualiza datos biométricos de un administrador
   */
  this.updateBiometricAdmin = async (req, res) => {
    const datos = req.body;
    const { nif } = req.params;

    console.log("Solicitud PUT recibida en /administradores/:nif");
    console.log(datos.activo);

    try {
      const numFilas = await Administrador.update(
        { ...datos, activo_biometria: datos.activo },
        { where: { nif } }
      );

      if (numFilas[0] === 0) {
        return res
          .status(404)
          .json(Respuesta.error(null, "Administrador no encontrado"));
      }

      res.status(204).send();
    } catch (error) {
      logMensaje(
        "Error al actualizar administrador: " + error.message,
        "error"
      );
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

  /**
   * GET /api/administradores/:Idadministrador
   * Devuelve el correo y nombre del administrador por su Idadministrador
   */
  this.getAdminById = async (req, res) => {
    const { Idadministrador } = req.params;

    try {
      if (!Idadministrador) {
        return res
          .status(400)
          .json(Respuesta.error(null, "El Idadministrador es obligatorio"));
      }

      logMensaje(
        `Buscando administrador con Idadministrador: ${Idadministrador}`,
        "info"
      );

      const admin = await Administrador.findOne({
        where: { Idadministrador: Idadministrador },
        attributes: ["Idadministrador", "nombre", "email"],
      });

      if (!admin) {
        return res
          .status(404)
          .json(
            Respuesta.error(
              null,
              `Administrador con Idadministrador ${Idadministrador} no encontrado`
            )
          );
      }

      const adminData = {
        nombre: admin.nombre,
        email: admin.email,
      };

      return res.status(200).json(Respuesta.exito(adminData));
    } catch (err) {
      logMensaje(
        `Error al obtener administrador por Idadministrador ${Idadministrador}: ${err.message}`,
        "error"
      );
      return res
        .status(500)
        .json(Respuesta.error(null, "Error interno del servidor"));
    }
  };
}

module.exports = new administradorController();
