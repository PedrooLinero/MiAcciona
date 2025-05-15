const Respuesta = require("../utils/respuesta.js");
const { logMensaje } = require("../utils/logger.js");
const initModels = require("../models/init-models.js").initModels;
const sequelize = require("../config/sequelize.js");
const jwt = require("jsonwebtoken");
const config = require("../config/config.js");

const models = initModels(sequelize);
const gestor = models.gestor;

function gestorController() {
  /**
   * POST /api/gestor/login
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

      const gestorEncontrado = await gestor.findOne({ where: { nif } });
      if (!gestorEncontrado) {
        return res
          .status(401)
          .json(Respuesta.error(null, "Gestor no encontrado"));
      }

      // Login clásico
      if (!huella && password !== gestorEncontrado.nif) {
        return res
          .status(401)
          .json(Respuesta.error(null, "Credenciales inválidas"));
      }

      // Generar token JWT
      const token = jwt.sign(
        {
          sub: gestorEncontrado.Idgestor,
          nif: gestorEncontrado.nif,
          rol: gestorEncontrado.rol,
        },
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
            id: gestorEncontrado.Idgestor,
            nombre: gestorEncontrado.nombre,
            primer_apellido: gestorEncontrado.primer_apellido,
            rol: gestorEncontrado.rol,
          },
          "Inicio de sesión exitoso"
        )
      );
    } catch (err) {
      logMensaje("Error en login de gestor: " + err.message, "error");
      return res
        .status(500)
        .json(Respuesta.error(null, "Error interno del servidor"));
    }
  };

  /**
   * POST /api/gestor/logout
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
   * GET /api/gestores
   * Devuelve todos los gestores
   */
  this.getAllgestors = async (req, res) => {
    try {
      const gestors = await gestor.findAll({
        attributes: ["Idgestor", "nombre", "primer_apellido", "rol", "email"],
      });
      return res.status(200).json(Respuesta.exito(gestors));
    } catch (err) {
      logMensaje("Error al obtener gestores: " + err.message, "error");
      return res
        .status(500)
        .json(Respuesta.error(null, "Error al obtener los gestores"));
    }
  };

  /**
   * GET /api/gestores/:nif
   * Recupera un gestor por su NIF
   */
  this.getgestorByNif = async (req, res) => {
    const { nif } = req.params;
    try {
      if (!nif) {
        return res
          .status(400)
          .json(Respuesta.error(null, "El NIF es obligatorio"));
      }
      const gestorEncontrado = await gestor.findOne({
        where: { nif },
        attributes: [
          "Idgestor",
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
      if (!gestorEncontrado) {
        return res
          .status(404)
          .json(Respuesta.error(null, "gestor no encontrado"));
      }

      // Transformar los datos para un formato más amigable
      const gestorData = {
        ...gestor.get({ plain: true }),
      };

      return res.status(200).json(Respuesta.exito(gestorData));
    } catch (err) {
      logMensaje("Error al obtener gestor por NIF: " + err.message, "error");
      return res
        .status(500)
        .json(Respuesta.error(null, "Error interno del servidor"));
    }
  };

  /**
   * PUT /api/gestores/:nif
   * Actualiza datos biométricos de un gestor
   */
  this.updateBiometricgestor = async (req, res) => {
    const datos = req.body;
    const { nif } = req.params;

    console.log("Solicitud PUT recibida en /gestores/:nif");
    console.log(datos.activo);

    try {
      const numFilas = await gestor.update(
        { ...datos, activo_biometria: datos.activo },
        { where: { nif } }
      );

      if (numFilas[0] === 0) {
        return res
          .status(404)
          .json(Respuesta.error(null, "gestor no encontrado"));
      }

      res.status(204).send();
    } catch (error) {
      logMensaje("Error al actualizar gestor: " + error.message, "error");
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
   * GET /api/gestores/:Idgestor
   * Devuelve el correo y nombre del gestor por su Idgestor
   */
  this.getgestorById = async (req, res) => {
    const { Idgestor } = req.params;

    try {
      if (!Idgestor) {
        return res
          .status(400)
          .json(Respuesta.error(null, "El Idgestor es obligatorio"));
      }

      logMensaje(`Buscando gestor con Idgestor: ${Idgestor}`, "info");

      // Corregir aquí: cambiar "gestor" por "gestorEncontrado"
      const gestorEncontrado = await gestor.findOne({
        // <--- gestor es el modelo (correcto)
        where: { Idgestor: Idgestor },
        attributes: ["Idgestor", "nombre", "email"],
      });

      if (!gestorEncontrado) {
        // <--- Usar la variable renombrada
        return res
          .status(404)
          .json(Respuesta.error(null, "Gestor no encontrado"));
      }

      const gestorData = {
        nombre: gestorEncontrado.nombre, // <--- Referencia corregida
        email: gestorEncontrado.email, // <--- Referencia corregida
      };

      return res.status(200).json(Respuesta.exito(gestorData));
    } catch (err) {
      logMensaje(
        `Error al obtener gestor por Idgestor ${Idgestor}: ${err.message}`,
        "error"
      );
      return res
        .status(500)
        .json(Respuesta.error(null, "Error interno del servidor"));
    }
  };

  this.getSolicitudes = async (req, res) => {
    const gestorId = parseInt(req.params.Idgestor, 10); // Obtener el ID del gestor desde el parámetro de la URL

    try {
      // Validar que gestorId sea un número
      if (isNaN(gestorId)) {
        return res.status(400).json(Respuesta.error(null, "Idgestor inválido"));
      }

      // Buscar solicitudes asociadas al gestor especificado
      const solicitudes = await models.solicitudes.findAll({
        where: { gestor_id: gestorId },
        include: [
          {
            model: models.usuarios,
            as: "usuario",
            attributes: ["nombre", "primer_apellido", "email", "nif"],
          },
          {
            model: models.tipoAusencia,
            as: "tipo_ausencia",
            attributes: ["nombre"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      // Devolver respuesta adecuada si no hay solicitudes
      if (solicitudes.length === 0) {
        return res
          .status(200)
          .json(Respuesta.exito([], "No hay solicitudes para este gestor"));
      }

      return res
        .status(200)
        .json(
          Respuesta.exito(solicitudes, "Solicitudes obtenidas correctamente")
        );
    } catch (error) {
      logMensaje(
        `Error al obtener solicitudes para gestorId ${gestorId}: ${error.message}`,
        "error"
      );
      return res
        .status(500)
        .json(Respuesta.error(null, "Error interno del servidor"));
    }
  };

  
}

module.exports = new gestorController();
