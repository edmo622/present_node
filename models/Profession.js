const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");

const Profession = sequelize.define(
  "profession",
  {
    PROFESSION_ID: {
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
    tableName: "profession",
    timestamps: false,
  }
);
module.exports =Profession;