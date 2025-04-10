const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");
const Provinces = require("./Provinces");

const Communes = sequelize.define(
  "syst_communes",
  {
    COMMUNE_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    COMMUNE_NAME: {
      type: DataTypes.STRING(50),
      allowNull: false,
    }, 
    PROVINCE_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,

    }, 
    COMMUNE_LATITUDE: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    
    },
    COMMUNE_LONGITUDE: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    
    },
  },
  {
    freezeTableName: true,
    tableName: "syst_communes",
    timestamps: false,
  }
);
Communes.belongsTo(Provinces, { as: "syst_provinces", foreignKey: "PROVINCE_ID" });
module.exports =Communes;