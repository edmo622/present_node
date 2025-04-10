const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");

const Categories = sequelize.define(
  "categories",
  {
    ID_TYPE_OUTILS: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    DESC_TYPE: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    tableName: "types_outils",
    timestamps: false,
  }
);
module.exports = Categories;