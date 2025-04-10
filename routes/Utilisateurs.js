// models/Utilisateurs.js
const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequilize");
const Profils = require("./Profils");
const Collines = require("../models/Collines");

const Utilisateurs = sequelize.define(
  "utilisateurs",
  {
    ID_UTILISATEUR: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    NOM: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    PRENOM: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    ID_PROFIL: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue:null
    },
    EMAIL:{
        type:DataTypes.STRING(40),
        allowNull:false
    },
    DATE_INSERTION:{
      type:DataTypes.DATE,
      allowNull:false,
      defaultValue:DataTypes.NOW
    },
    COLLINE_ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue:null
    },
  },
  {
    freezeTableName: true,
    tableName: "utilisateurs",
    timestamps: false,
  }
);

module.exports = Utilisateurs;