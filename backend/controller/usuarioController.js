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
          "id_gestor",
        ],
        include: [
          {
            association: "ausencias", // Usar el alias de la asociación definida en el modelo
            attributes: ["dias_permitidos"],
            include: [
              {
                association: "tipo_ausencia", // Alias de la asociación en usuario_ausencia
                attributes: ["nombre"],
              },
            ],
          },
        ],
      });

      if (!user) {
        return res
          .status(404)
          .json(Respuesta.error(null, "Usuario no encontrado"));
      }

      // Transformar las ausencias a un objeto clave-valor
      const ausenciasTransformadas = user.ausencias.reduce((acc, ausencia) => {
        if (ausencia.tipo_ausencia) {
          acc[ausencia.tipo_ausencia.nombre] = ausencia.dias_permitidos;
        }
        return acc;
      }, {});

      // Construir el objeto de respuesta final
      const userData = {
        ...user.get({ plain: true }),
        ausencias: ausenciasTransformadas,
      };

      // Eliminar la propiedad original de ausencias que ya no necesitamos
      delete userData.ausencias;

      return res.status(200).json(Respuesta.exito(userData));
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

  this.crearSolicitud = async (req, res) => {
    const { nif, id_tipo, titulo, descripcion, fechaInicio, fechaFin } =
      req.body;

    try {
      // Validar campos obligatorios
      if (
        !nif ||
        !id_tipo ||
        !titulo ||
        !descripcion ||
        !fechaInicio ||
        !fechaFin
      ) {
        return res
          .status(400)
          .json(Respuesta.error(null, "Faltan campos obligatorios"));
      }

      // Buscar al usuario por NIF
      const usuario = await models.usuarios.findOne({ where: { nif } });
      if (!usuario) {
        return res
          .status(404)
          .json(Respuesta.error(null, "Usuario no encontrado"));
      }

      // Verificar que el usuario tenga un gestor asignado
      if (!usuario.id_gestor) {
        return res
          .status(400)
          .json(
            Respuesta.error(null, "El usuario no tiene un gestor asignado")
          );
      }

      // Verificar que el tipo de ausencia exista
      const tipoAusencia = await models.tipoAusencia.findByPk(id_tipo);
      if (!tipoAusencia) {
        return res
          .status(400)
          .json(Respuesta.error(null, "Tipo de ausencia no válido"));
      }

      // Validar que fecha_inicio sea anterior a fecha_fin
      if (new Date(fechaInicio) > new Date(fechaFin)) {
        return res
          .status(400)
          .json(
            Respuesta.error(
              null,
              "La fecha de inicio debe ser anterior a la fecha de fin"
            )
          );
      }

      // Calcular días solicitados y verificar disponibilidad
      const diasSolicitados =
        Math.ceil(
          (new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24)
        ) + 1;
      const ausencia = await models.usuarioAusencia.findOne({
        where: { id_usuario: usuario.Idusuario, id_tipo },
      });
      if (!ausencia || diasSolicitados > ausencia.dias_permitidos) {
        return res
          .status(400)
          .json(
            Respuesta.error(
              null,
              `No hay suficientes días disponibles. Disponibles: ${ausencia?.dias_permitidos || 0}`
            )
          );
      }

      // Crear la solicitud
      console.log("Datos para crear solicitud:", {
        usuario_id: usuario.Idusuario,
        gestor_id: usuario.id_gestor,
        tipo_ausencia_id: id_tipo,
        titulo,
        descripcion,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        estado: "pendiente",
      });

      const solicitud = await models.solicitudes.create({
        usuario_id: usuario.Idusuario,
        gestor_id: usuario.id_gestor,
        tipo_ausencia_id: id_tipo,
        titulo,
        descripcion,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        estado: "pendiente",
      });

      return res
        .status(201)
        .json(Respuesta.exito(solicitud, "Solicitud enviada correctamente"));
    } catch (error) {
      logMensaje("Error al crear solicitud: " + error.message, "error");
      return res
        .status(500)
        .json(
          Respuesta.error(null, "Error interno del servidor: " + error.message)
        );
    }
  };

  // GET /api/solicitudes?nif=12345678Z
  this.getSolicitudesPorUsuario = async (req, res) => {
    const nif = req.params.nif;
    try {
      if (!nif) {
        return res
          .status(400)
          .json(Respuesta.error(null, "Falta el parámetro nif"));
      }

      // Buscar usuario
      const usuario = await models.usuarios.findOne({ where: { nif } });
      if (!usuario) {
        return res
          .status(404)
          .json(Respuesta.error(null, "Usuario no encontrado"));
      }

      // Buscar sus solicitudes
      const solicitudes = await models.solicitudes.findAll({
        where: { usuario_id: usuario.Idusuario },
        include: [
          {
            model: models.tipoAusencia,
            as: "tipo_ausencia",
            attributes: ["nombre"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      return res
        .status(200)
        .json(
          Respuesta.exito(solicitudes, "Solicitudes del usuario obtenidas")
        );
    } catch (error) {
      logMensaje("Error al obtener solicitudes de usuario: " + error, "error");
      return res
        .status(500)
        .json(Respuesta.error(null, "Error interno del servidor"));
    }
  };
}

module.exports = new UsuarioController();
