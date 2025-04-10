const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");

const Provinces = sequelize.define(
  "syst_provinces",
  {
    PROVINCE_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    PROVINCE_NAME: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    CIRCONSCRIPTION_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
 
    },
    PROVINCE_LATITUDE: {
      type: DataTypes.DOUBLE,
      allowNull: false,
 
    },
    PROVINCE_LONGITUDE: {
      type: DataTypes.DOUBLE,
      allowNull: false,
 
    },
  },
  {
    freezeTableName: true,
    tableName: "syst_provinces",
    timestamps: false,
  }
);
module.exports =Provinces;