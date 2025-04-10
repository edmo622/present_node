const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");

const Outils_stock = sequelize.define(
  "outils_stock",
  {
    ID_SOCK : {
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
    tableName: "outils_stock",
    timestamps: false,
  }
);
module.exports =Outils_stock;