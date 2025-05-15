// backend/models/index.js
require('dotenv').config();

const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');   // tu configuración de conexión
const initModels = require('./init-models');        // el que sequelize-auto generó



// Inicializamos TODOS los modelos y relaciones
const models = initModels(sequelize);

// Exportamos el objeto con todos
module.exports = models;
