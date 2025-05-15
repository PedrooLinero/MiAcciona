var DataTypes = require("sequelize").DataTypes;
var _tipoAusencia = require("./tipoAusencia");
var _usuarios = require("./usuarios");
var _usuarioAusencia = require("./usuarioAusencia");
var _administrador = require("./administrador");
var _solicitudes = require("./solicitudes"); // Agregar el nuevo modelo

function initModels(sequelize) {
  var tipoAusencia = _tipoAusencia(sequelize, DataTypes);
  var usuarios = _usuarios(sequelize, DataTypes);
  var usuarioAusencia = _usuarioAusencia(sequelize, DataTypes);
  var administrador = _administrador(sequelize, DataTypes);
  var solicitudes = _solicitudes(sequelize, DataTypes); // Inicializar solicitudes

  // Asociaciones existentes
  usuarios.hasMany(usuarioAusencia, { foreignKey: 'id_usuario', as: 'ausencias' });
  usuarioAusencia.belongsTo(usuarios, { foreignKey: 'id_usuario', as: 'usuario' });

  tipoAusencia.hasMany(usuarioAusencia, { foreignKey: 'id_tipo', as: 'ausencias' });
  usuarioAusencia.belongsTo(tipoAusencia, { foreignKey: 'id_tipo', as: 'tipo_ausencia' });

  usuarios.belongsTo(administrador, { foreignKey: 'id_administrador', as: 'administrador' });
  administrador.hasMany(usuarios, { foreignKey: 'id_administrador', as: 'usuarios' });

  // Nuevas asociaciones para solicitudes
  solicitudes.belongsTo(usuarios, { foreignKey: 'usuario_id', as: 'usuario' });
  solicitudes.belongsTo(administrador, { foreignKey: 'administrador_id', as: 'administrador' });
  solicitudes.belongsTo(tipoAusencia, { foreignKey: 'tipo_ausencia_id', as: 'tipo_ausencia' });

  usuarios.hasMany(solicitudes, { foreignKey: 'usuario_id', as: 'solicitudes' });
  administrador.hasMany(solicitudes, { foreignKey: 'administrador_id', as: 'solicitudes' });
  tipoAusencia.hasMany(solicitudes, { foreignKey: 'tipo_ausencia_id', as: 'solicitudes' });

  return {
    tipoAusencia,
    usuarios,
    usuarioAusencia,
    administrador,
    solicitudes // Agregar solicitudes al objeto retornado
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;