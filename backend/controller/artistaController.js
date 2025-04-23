// Importar libreria para respuestas
const Respuesta = require("../utils/respuesta");
const { logMensaje } = require("../utils/logger.js");
// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");

// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);
// Recuperar el modelo obra
const Artista = models.artistas;

class ArtistaController {
  async createArtista(req, res) {
    // Implementa la lógica para crear una nueva obra
    const artista = req.body;

    try {
      const artistaNueva = await Artista.create(artista);

      res.status(201).json(Respuesta.exito(artistaNueva, "Artista insertado"));
    } catch (err) {
      logMensaje("Error :" + err);
      res
        .status(500)
        .json(
          Respuesta.error(null, `Error al crear un artista nuevo: ${artista}`)
        );
    }
  }

  async getAllArtista(req, res) {
    try {
      console.log("Entrando en getAllArtista");

      // 🔴 Registra la consulta que Sequelize genera
      const data = await Artista.findAll({
        logging: console.log, // Muestra la consulta en consola
      });

      res.json(Respuesta.exito(data, "Datos de artistas recuperados"));
    } catch (err) {
      console.error("Error en getAllArtista:", err);

      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los datos de los artistas: ${req.originalUrl}`
          )
        );
    }
  }

  async updateArtista(req, res) {
    const artista = req.body; // Recuperamos datos para actualizar
    const idartista = req.params.idartista; // dato de la ruta

    // Petición errónea, no coincide el id del plato de la ruta con el del objeto a actualizar
    if (idartista != artista.idartista) {
      return res
        .status(400)
        .json(Respuesta.error(null, "El id del artista no coincide"));
    }

    try {
      const numFilas = await Artista.update(
        { ...artista },
        { where: { idartista } }
      );

      if (numFilas == 0) {
        // No se ha encontrado lo que se quería actualizar o no hay nada que cambiar
        res
          .status(404)
          .json(
            Respuesta.error(null, "No encontrado o no modificado: " + idartista)
          );
      } else {
        // Al dar status 204 no se devuelva nada
        // res.status(204).json(Respuesta.exito(null, "Plato actualizado"));
        res.status(204).send();
      }
    } catch (err) {
      logMensaje("Error :" + err);
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al actualizar los datos: ${req.originalUrl}`
          )
        );
    }
  }

  async getArtistaById(req, res) {
    // Implementa la lógica para recuperar una obra por su id
    const idartista = req.params.idartista;

    try {
      const fila = await Artista.findByPk(idartista);
      if (fila) {
        res.json(Respuesta.exito(fila, "Artista recuperado"));
      } else {
        res.status(404).json(Respuesta.error(null, "Artista no encontrado"));
      }
    } catch (err) {
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar el artista: ${req.originalUrl}`
          )
        );
    }
  }

  // Implementar el método para buscar por tipo de arte
  async getArtistaByTipoArte(req, res) {
    const tipoArte = req.params.tipoArte; // Recuperamos el tipo de arte desde los parámetros de la ruta
  
    try {
      // Busca los artistas por tipo de arte en la base de datos
      const artistas = await Artista.findAll({
        where: {
          tipoArte: tipoArte, // Coincidencia exacta del tipo de arte
        },
      });
  
      if (artistas.length > 0) {
        res.json(Respuesta.exito(artistas, "Artistas recuperados"));
      } else {
        res.status(404).json(Respuesta.error(null, "No se encontraron artistas con ese tipo de arte"));
      }
    } catch (err) {
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los artistas por tipo de arte: ${req.originalUrl}`
          )
        );
    }
  }

  async deleteArtista(req, res) {
    const idartista = req.params.idartista;
    const t = await sequelize.transaction();

    try {
      // Luego, eliminar el artista
      const numFilas = await Artista.destroy({
        where: { idartista: idartista },
        transaction: t,
      });

      if (numFilas == 0) {
        await t.rollback();
        return res
          .status(404)
          .json(Respuesta.error(null, "No encontrado: " + idartista));
      }

      await t.commit();
      res.status(204).send();
    } catch (err) {
      await t.rollback();
      logMensaje("Error :" + err);
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al eliminar los datos: ${req.originalUrl}`
          )
        );
    }
  }

  async getArtistaByNombre(req, res) {
    const nombre = req.params.nombre;
    try {
      const data = await Artista.findOne({
        where: {
          nombre: nombre,
        },
      });
      if (data) {
        res.json(Respuesta.exito(data, "Artista recuperado"));
      } else {
        res.status(404).json(Respuesta.error(null, "Artista no encontrado"));
      }
    } catch (err) {
      logMensaje("Error :" + err);
      res.status(500).json(
        Respuesta.error(null, `Error al recuperar los datos: ${req.originalUrl}`)
      );
    }
  }
}

module.exports = new ArtistaController();
