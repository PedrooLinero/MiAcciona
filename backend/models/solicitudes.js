const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('solicitudes', {
    id_solicitud: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'Idusuario'
      }
    },
    administrador_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'administrador',
        key: 'Idadministrador'
      }
    },
    tipo_ausencia_id: {
      type: DataTypes.TINYINT,
      allowNull: false,
      references: {
        model: 'tipo_ausencia',
        key: 'id_tipo'
      }
    },
    titulo: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fecha_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fecha_fin: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('pendiente','aceptada','rechazada'),
      allowNull: false,
      defaultValue: "pendiente"
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'solicitudes',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_solicitud" },
        ]
      },
      {
        name: "idx_usuario_id",
        using: "BTREE",
        fields: [
          { name: "usuario_id" },
        ]
      },
      {
        name: "idx_administrador_id",
        using: "BTREE",
        fields: [
          { name: "administrador_id" },
        ]
      },
      {
        name: "idx_tipo_ausencia_id",
        using: "BTREE",
        fields: [
          { name: "tipo_ausencia_id" },
        ]
      },
    ]
  });
};
