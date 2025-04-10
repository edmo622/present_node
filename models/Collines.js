const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");
const Zones = require("./Zones");

const Collines = sequelize.define(
  "syst_collines",
  {
    COLLINE_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    COLLINE_NAME: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    ZONE_ID: {
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
    tableName: "syst_collines",
    timestamps: false,
  }
);
Collines.belongsTo(Zones, { as: "syst_zones", foreignKey: "ZONE_ID" });
module.exports =Collines;