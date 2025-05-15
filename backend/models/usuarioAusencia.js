const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usuarioAusencia', {
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'usuarios',
        key: 'Idusuario'
      }
    },
    id_tipo: {
      type: DataTypes.TINYINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'tipo_ausencia',
        key: 'id_tipo'
      }
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
        fields: [
          { name: "id_usuario" },
          { name: "id_tipo" },
        ]
      },
      {
        name: "fk_usuario_ausencia_tipo",
        using: "BTREE",
        fields: [
          { name: "id_tipo" },
        ]
      },
    ]
  });
};
