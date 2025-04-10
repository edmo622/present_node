const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");

const Profils = sequelize.define(
  "profils",
  {
    ID_PROFIL: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    STATUT: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    tableName: "profils",
    timestamps: false,
  }
);
module.exports = Profils;