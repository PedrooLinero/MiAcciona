const { Sequelize, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('solicitudes', {
    id_solicitud: {
      type: DataTypes.INTEGER,
      primaryKey: true,         // Define explícitamente como clave primaria
      autoIncrement: true,      // Habilita el auto-incremento
      allowNull: false,
      field: 'id_solicitud'     // Mapea al nombre exacto de la columna en la DB
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    administrador_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo_ausencia_id: {
      type: DataTypes.INTEGER,
      allowNull: false
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
      type: DataTypes.ENUM('pendiente', 'aceptada', 'rechazada'),
      allowNull: false,
      defaultValue: 'pendiente'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'solicitudes',  // Nombre exacto de la tabla
    timestamps: false          // Desactiva timestamps automáticos si no los usas
  });
};