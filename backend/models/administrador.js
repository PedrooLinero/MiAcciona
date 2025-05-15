const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('administrador', {
    Idadministrador: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    primer_apellido: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    segundo_apellido: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nif: {
      type: DataTypes.CHAR(9),
      allowNull: false,
      unique: "nif"
    },
    fechanacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    actividad: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    rol: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    token_huella: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    activo_biometria: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    subdivision_personal: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'administrador',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Idadministrador" },
        ]
      },
      {
        name: "nif",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "nif" },
        ]
      },
      {
        name: "idx_email",
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
    ]
  });
};
