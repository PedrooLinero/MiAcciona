var DataTypes = require("sequelize").DataTypes;
var _usuarios = require("./usuarios"); // 👈 AÑADE ESTO

function initModels(sequelize) {
  var usuarios = _usuarios(sequelize, DataTypes); // 👈 AÑADE ESTO

  return {
    usuarios // 👈 AÑADE ESTO
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
