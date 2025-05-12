var DataTypes = require("sequelize").DataTypes;
var _tipoAusencia = require("./tipoAusencia");
var _usuarios = require("./usuarios");

function initModels(sequelize) {
  var tipoAusencia = _tipoAusencia(sequelize, DataTypes);
  var usuarios = _usuarios(sequelize, DataTypes);


  return {
    tipoAusencia,
    usuarios,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
