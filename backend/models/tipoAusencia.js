// models/tipoAusencia.js
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('tipo_ausencia', {
      id_tipo: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      }
    }, {
      sequelize,
      tableName: 'tipo_ausencia',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id_tipo' }]
        },
        {
          name: 'nombre_unique',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'nombre' }]
        }
      ]
    });
  };
  