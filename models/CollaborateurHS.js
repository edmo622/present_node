const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");


const CollaborateurHS = sequelize.define(
  "collaborateurs",
  {
    COLLABORATEUR_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    NOM_PRENOM: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    EQUIPE_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      PROFIL_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      EMAIL: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  },
  {
    freezeTableName: true,
    tableName: "collaborateurs",
    timestamps: false,
  }
);
// Affectation.belongsTo(Collaborateurs, { as: "collaborateurs", foreignKey: "COLLABORATEUR_ID" });
module.exports =CollaborateurHS;
