const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const TipoAusencia = sequelize.define('tipo_ausencia', {
    id_tipo: {
      autoIncrement: true,
      type: DataTypes.TINYINT,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "nombre"
    }
  }, {
    sequelize,
    tableName: 'tipo_ausencia',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "id_tipo" }]
      },
      {
        name: "nombre",
        unique: true,
        using: "BTREE",
        fields: [{ name: "nombre" }]
      }
    ]
  });

  TipoAusencia.associate = function(models) {
    TipoAusencia.hasMany(models.usuario_ausencia, { foreignKey: 'id_tipo', as: 'ausencias' });
  };

  return TipoAusencia;
};