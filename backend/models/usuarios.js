const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Usuarios = sequelize.define('usuarios', {
    Idusuario: {
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
      type: DataTypes.CHAR(9), // Cambiado a CHAR(9) para mayor eficiencia
      allowNull: false,
      unique: "nif"
    },
    fechanacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    estado: {
      type: DataTypes.TINYINT(1), // BOOLEAN puede mapearse a TINYINT(1)
      allowNull: false,
      defaultValue: 1
    },
    actividad: {
      type: DataTypes.TINYINT(1),
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
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0
    },
    subdivision_personal: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    id_gestor: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'usuarios',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "Idusuario" }]
      },
      {
        name: "nif",
        unique: true,
        using: "BTREE",
        fields: [{ name: "nif" }]
      },
      {
        name: "idx_email",
        using: "BTREE",
        fields: [{ name: "email" }]
      },
      {
        name: "idx_gestor",
        using: "BTREE",
        fields: [{ name: "id_gestor" }]
      }
    ]
  });

  Usuarios.associate = function(models) {
    Usuarios.hasMany(models.usuario_ausencia, { foreignKey: 'id_usuario', as: 'ausencias' });
    Usuarios.belongsTo(models.gestor, { foreignKey: 'id_gestor', as: 'gestor' });
  };

  return Usuarios;
};