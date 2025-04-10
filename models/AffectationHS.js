const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");
// const CollaborateurHS = require("./CollaborateurHS");
const Projets = require("./Projets");


const AffectationHS = sequelize.define(
  "affectation_heure_supp",
  {
    AFFECTATION_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    COLLABORATEUR_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }, 	

    ID_VALIDATION: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      PROJET_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },


    TACHE: {
        type: DataTypes.STRING(220),
        allowNull: false,
      },
      STATUS: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
  },
  {
    freezeTableName: true,
    tableName: "affectation_heure_supp",
    timestamps: false,
  }
);
AffectationHS.belongsTo(CollaborateurHS, { as: "collaborateurs", foreignKey: "COLLABORATEUR_ID" });
AffectationHS.belongsTo(Projets, { as: "projets", foreignKey: "PROJET_ID" });
module.exports =AffectationHS;
