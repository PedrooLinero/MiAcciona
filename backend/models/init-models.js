var DataTypes = require("sequelize").DataTypes;
var _usuarios = require("./usuarios");
var _tipoAusencia = require("./tipoAusencia");

function initModels(sequelize) {
  var usuarios = _usuarios(sequelize, DataTypes);
  var tipoAusencia = _tipoAusencia(sequelize, DataTypes);

  return {
    usuarios,
    tipoAusencia
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
