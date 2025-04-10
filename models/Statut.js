const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");

const Statut = sequelize.define(
  "statut",
  {
    STATUT_ID: {
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
    tableName: "statut",
    timestamps: false,
  }
);
module.exports =Statut;