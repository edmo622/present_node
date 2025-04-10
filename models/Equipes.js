const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");

const Equipes = sequelize.define(
  "equipe",
  {
    EQUIPE_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    DESC_EQUIPE: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    tableName: "equipe",
    timestamps: false,
  }
);
module.exports =Equipes;