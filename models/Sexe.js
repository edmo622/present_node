const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");

const Sexe = sequelize.define(
  "genre",
  {
    SEXE_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    DESCRIPTION: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    tableName: "genre",
    timestamps: false,
  }
);
module.exports =Sexe;