const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");
const Communes = require("./Communes");

const Zones = sequelize.define(
  "syst_zones",
  {
    ZONE_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    ZONE_NAME: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    COMMUNE_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
 
    },
    LATITUDE: {
      type: DataTypes.DOUBLE,
      allowNull: false,
 
    },
    LONGITUDE: {
      type: DataTypes.DOUBLE,
      allowNull: false,
 
    },
  },
  {
    freezeTableName: true,
    tableName: "syst_zones",
    timestamps: false,
  }
);
Zones.belongsTo(Communes, { as: "syst_communes", foreignKey: "COMMUNE_ID" });
module.exports =Zones;