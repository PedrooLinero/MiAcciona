module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "artistas",
    {
      idartista: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      apellidos: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      fechaNacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      tipoArte: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      paisDeNacimiento:{
        type: DataTypes.STRING(50),
        allowNull: false,
      }
    },
    {
      sequelize,
      tableName: "artistas",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "idartista" },
          ]
        },
        {
          name: "FK_OBRAS",
          using: "BTREE",
          fields: [
            { name: "idobra" },
          ]
        },
      ]
    }
  );
};
