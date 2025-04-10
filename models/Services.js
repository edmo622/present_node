const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");

const Services = sequelize.define(
  "services",
  {
    ID_SERVICE: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    DESC_SERVICE: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    tableName: "service",
    timestamps: false,
  }
);
module.exports = Services;