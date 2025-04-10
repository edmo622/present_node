const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");

const Validations = sequelize.define(
  "validations",
  {
    ID_VALIDATION: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    DESC_VALIDATION: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    tableName: "validation",
    timestamps: false,
  }
);
module.exports = Validations;