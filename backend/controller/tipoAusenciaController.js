const Respuesta   = require("../utils/respuesta.js");
const { logMensaje } = require("../utils/logger.js");
const initModels  = require("../models/init-models.js").initModels;
const sequelize   = require("../config/sequelize.js");
const jwt         = require("jsonwebtoken");
const config      = require("../config/config.js");

const models      = initModels(sequelize);
const tipoAusencia  = models.tipoAusencia; 

function TipoAusenciaController() {
    this.getTiposAusencia = async (req, res) => {
      try {
        const tipos = await tipoAusencia.findAll();
        return res.status(200).json(tipos);
      } catch (error) {
        console.error("Error al obtener tipos de ausencia:", error);
        return res.status(500).json({ mensaje: "Error interno del servidor" });
      }
    };
  }
  
  module.exports = new TipoAusenciaController();
