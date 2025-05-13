var DataTypes = require("sequelize").DataTypes;
var _tipoAusencia = require("./tipoAusencia");
var _usuarios = require("./usuarios");
var _usuarioAusencia = require("./usuarioAusencia");
var _administrador = require("./administrador");

function initModels(sequelize) {
  var tipoAusencia = _tipoAusencia(sequelize, DataTypes);
  var usuarios = _usuarios(sequelize, DataTypes);
  var usuarioAusencia = _usuarioAusencia(sequelize, DataTypes);
  var administrador = _administrador(sequelize, DataTypes);

  // Definir asociaciones
  usuarios.hasMany(usuarioAusencia, { foreignKey: 'id_usuario', as: 'ausencias' });
  usuarioAusencia.belongsTo(usuarios, { foreignKey: 'id_usuario', as: 'usuario' });

  tipoAusencia.hasMany(usuarioAusencia, { foreignKey: 'id_tipo', as: 'ausencias' });
  usuarioAusencia.belongsTo(tipoAusencia, { foreignKey: 'id_tipo', as: 'tipo_ausencia' });

  usuarios.belongsTo(administrador, { foreignKey: 'id_administrador', as: 'administrador' });
  administrador.hasMany(usuarios, { foreignKey: 'id_administrador', as: 'usuarios' });

  return {
    tipoAusencia,
    usuarios,
    usuarioAusencia,
    administrador,
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;