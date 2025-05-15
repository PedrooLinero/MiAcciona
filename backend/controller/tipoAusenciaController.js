const Respuesta = require("../utils/respuesta.js");
const { logMensaje } = require("../utils/logger.js");
const initModels = require("../models/init-models.js").initModels;
const sequelize = require("../config/sequelize.js");
const jwt = require("jsonwebtoken");
const config = require("../config/config.js");

const models = initModels(sequelize);

// Verifica qué modelos están disponibles
console.log("Modelos disponibles:", Object.keys(models));

// Asegúrate de usar el nombre correcto del modelo
const tipoAusencia = models.tipo_ausencia || models.tipoAusencia;

function TipoAusenciaController() {
  this.getTiposAusencia = async (req, res) => {
    try {
      // Usa directamente la variable tipoAusencia
      const tipos = await tipoAusencia.findAll();
      return res.status(200).json(tipos);
    } catch (error) {
      console.error("Error al obtener tipos de ausencia:", error);
      return res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  };

  this.getDiasPorTipo = async (req, res) => {
    const { nif } = req.params;
    
    try {
      console.log("Ejecutando getDiasPorTipo para NIF:", nif);
      console.log("Modelos disponibles:", Object.keys(models));
      
      // 1. Buscar el usuario con sus ausencias
      console.log("Buscando usuario con NIF:", nif);
      const usuario = await models.usuarios.findOne({
        where: { nif },
        include: [
          {
            association: "ausencias",
            attributes: ["id_tipo", "dias_permitidos"],
            include: [
              {
                // Usa el nombre correcto de la asociación
                association: "tipo_ausencia",
                attributes: ["nombre"],
              },
            ],
          },
        ],
      });

      if (!usuario) {
        console.log("Usuario no encontrado con NIF:", nif);
        return res
          .status(404)
          .json(Respuesta.error(null, "Usuario no encontrado"));
      }

      // 2. Obtener todos los tipos de ausencia
      // Usa directamente la variable tipoAusencia en lugar de models.tipo_ausencia
      console.log("Obteniendo todos los tipos de ausencia");
      const tipos = await tipoAusencia.findAll();
      console.log("Tipos de ausencia encontrados:", tipos.length);

      // 3. Crear estructura de datos combinada
      console.log("Creando estructura de datos combinada");
      const diasPorTipo = tipos.reduce((acc, tipo) => {
        // Buscar si el usuario tiene días para este tipo
        const ausenciaUsuario = usuario.ausencias.find(
          (a) => a.id_tipo === tipo.id_tipo
        );

        acc[tipo.nombre] = ausenciaUsuario
          ? ausenciaUsuario.dias_permitidos
          : 0; // Valor por defecto

        return acc;
      }, {});

      // 4. Agregar datos básicos del usuario
      const respuesta = {
        Idusuario: usuario.Idusuario,
        nombre: usuario.nombre,
        apellidos:
          `${usuario.primer_apellido} ${usuario.segundo_apellido || ""}`.trim(),
        nif: usuario.nif,
        email: usuario.email,
        id_gestor: usuario.id_gestor,
        dias_por_tipo: diasPorTipo,
      };

      console.log("Enviando respuesta exitosa");
      return res.status(200).json(Respuesta.exito(respuesta));
    } catch (error) {
      console.error("Error completo:", error);
      logMensaje(`Error obteniendo días por tipo: ${error.message}`, "error");
      return res
        .status(500)
        .json(Respuesta.error(null, "Error interno del servidor"));
    }
  };
}

module.exports = new TipoAusenciaController();