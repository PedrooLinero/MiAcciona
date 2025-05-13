const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const UsuarioAusencia = sequelize.define('usuario_ausencia', {
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_tipo: {
      type: DataTypes.TINYINT,
      allowNull: false,
      primaryKey: true
    },
    dias_permitidos: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'usuario_ausencia',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "id_usuario" }, { name: "id_tipo" }]
      }
    ]
  });

  UsuarioAusencia.associate = function(models) {
    UsuarioAusencia.belongsTo(models.usuarios, { foreignKey: 'id_usuario', as: 'usuario' });
    UsuarioAusencia.belongsTo(models.tipo_ausencia, { foreignKey: 'id_tipo', as: 'tipo_ausencia' });
  };

  return UsuarioAusencia;
};