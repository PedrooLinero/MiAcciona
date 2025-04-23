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
const Obra = models.obras;
const Artista = models.artistas;

class ObraController {
  // grafica que muestra el numero de obras por el id del artista
  async getGraficaObras(req, res) {
    try {
      const obrasGrafica = await Obra.findAll({
        attributes: [
          'idartista',
          [sequelize.fn('COUNT', sequelize.col('idobra')), 'numeroObras']
        ],
        include: [
          {
            model: Artista,
            as: 'artista',
            attributes: ['nombre'],
            required: false 

          }
        ],
        group: ['idartista', 'artista.nombre'],
        raw: true
      });
      res.json({
        exito: true,
        datos: obrasGrafica,
        mensaje: "Datos de obras recuperados"
      });
    } catch (error) {
      console.error("Error al recuperar los datos de las obras", error);
      res.status(500).json({
        exito: false,
        mensaje: `Error al recuperar los datos de las obras: ${req.originalUrl}`
      });
    }
  }
  

  async createObra(req, res) {
    // Implementa la lógica para crear una nueva obra
    const obra = req.body;

    console.log("Obra recibida: ", obra);  // 👈 Agregar esto
    try {
      const obraNueva = await Obra.create(obra);

      res.status(201).json(Respuesta.exito(obraNueva, "Obra insertada"));
    } catch (err) {
      logMensaje("Error :" + err);
      res
        .status(500)
        .json(Respuesta.error(null, `Error al crear una obra nueva: ${obra}`));
    }
  }

  async getAllObra(req, res) {
    try {
      console.log("Entrando en getAllObra");  // 👈 Agregar esto
      const data = await Obra.findAll(); // Recuperar todos los obras
      res.json(Respuesta.exito(data, "Datos de obras recuperadas"));
    } catch (err) {
      // Handle errors during the model call
      console.error("Error en getAllObra:", err);  // 👈 Agregar esto

      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los datos de las obras: ${req.originalUrl}`
          )
        );
    }
  }

  async updateObra(req, res) {
    const obra = req.body; // Recuperamos datos para actualizar
    const idobra = req.params.idobra; // dato de la ruta

    // Petición errónea, no coincide el id del plato de la ruta con el del objeto a actualizar
    if (idobra != obra.idobra) {
      return res
        .status(400)
        .json(Respuesta.error(null, "El id de la obra no coincide"));
    }

    try {
      const numFilas = await Obra.update({ ...obra }, { where: { idobra } });

      if (numFilas == 0) {
        // No se ha encontrado lo que se quería actualizar o no hay nada que cambiar
        res
          .status(404)
          .json(Respuesta.error(null, "No encontrado o no modificado: " + idobra));
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

  async deleteObra(req, res) {
    const idobra = req.params.idobra;
    try {
      const numFilas = await Obra.destroy({
        where: {
            idobra: idobra,
        },
      });
      if (numFilas == 0) {
        // No se ha encontrado lo que se quería borrar
        res
          .status(404)
          .json(Respuesta.error(null, "No encontrado: " + idobra));
      } else {
        res.status(204).send();
      }
    } catch (err) {
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

  async getObraById(req, res) {
    // El id plato viene en la ruta /api/platos/:idobra
    const idobra = req.params.idobra;
    try {
      const fila = await Obra.findByPk(idobra);
      if (fila) {
        // Si se ha recuprado un plato
        res.json(Respuesta.exito(fila, "Obra recuperada"));
      } else {
        res.status(404).json(Respuesta.error(null, "Obra no encontrada"));
      }
    } catch (err) {
      logMensaje("Error :" + err);
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los datos: ${req.originalUrl}`
          )
        );
    }
  }

  async getObraByArtista(req, res) {
    // El id plato viene en la ruta /api/platos/idartista/:idartista
    const idartista = req.params.idartista;
    try {
      const data = await Obra.findAll({
        where: {
          idartista: idartista,
        },
      });
      res.json(Respuesta.exito(data, "Obras recuperadas"));
    } catch (err) {
      logMensaje("Error :" + err);
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los datos: ${req.originalUrl}`
          )
        );
    }
  }

async getObraByNombre(req, res) {
  const nombre = req.params.nombre;
  try {
    const data = await Obra.findOne({
      where: {
        nombre: nombre,
      },
    });
    if (data) {
      res.json(Respuesta.exito(data, "Obra recuperada"));
    } else {
      res.status(404).json(Respuesta.error(null, "Obra no encontrada"));
    }
  } catch (err) {
    logMensaje("Error :" + err);
    res.status(500).json(
      Respuesta.error(null, `Error al recuperar los datos: ${req.originalUrl}`)
    );
  }
}

  

  
}

module.exports = new ObraController();

// Structure of result (MySQL)
// {
//   fieldCount: 0,
//   affectedRows: 1, // Number of rows affected by the query
//   insertId: 1,     // ID generated by the insertion operation
//   serverStatus: 2,
//   warningCount: 0,
//   message: '',
//   protocol41: true,
//   changedRows: 0   // Number of rows changed by the query
// }

