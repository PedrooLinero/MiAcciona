const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('obras', {
    idobra: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    precio: {
      type: DataTypes.DECIMAL(8,2),
      allowNull: false
    },
    idartista: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imagen_url:{
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'obras',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idobra" },
        ]
      },
    ]
  });
};