const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");


const HistoriqueHS = sequelize.define(
  "collaborateurs",
  {
    ID_HISTO_HEURE: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    AFFECTATION_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    ID_VALIDATION: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      STATUS: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      USER_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      COMMENTAIRE: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      DATE_CREATION: {
        type: DataTypes.NOW,
        allowNull: false,
      },

  },
  {
    freezeTableName: true,
    tableName: "histo_heure_sup",
    timestamps: false,
  }
);
// Affectation.belongsTo(Collaborateurs, { as: "collaborateurs", foreignKey: "COLLABORATEUR_ID" });
module.exports =HistoriqueHS;
