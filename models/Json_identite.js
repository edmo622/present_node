const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");
const Json_identite = require("./Json_identite");

const json_identite = sequelize.define(
  "json_identite",
  {
    JSON_ID : {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    DATA_JSON: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    STATUT: {
      type: DataTypes.INTEGER,
      allowNull: true,
 
    },

    TRAITER_IMAGE: {
      type: DataTypes.INTEGER,
      allowNull: true,
 
    },
    DATE_INSERTION: {
      type: DataTypes.DATE,
      allowNull: true,
 
    },
  },
  {
    freezeTableName: true,
    tableName: "json_identite",
    timestamps: false,
  }
);

// Json_identite.belongsTo(Zones, { as: "zones", foreignKey: "ZONE_ID" });
module.exports =json_identite;