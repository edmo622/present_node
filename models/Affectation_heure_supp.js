const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize');
const Projets = require('./Projets');
const Collaborateurs = require('./Collaborateurs');
const Validations = require('./Validations');

const Affectation_heure_supp = sequelize.define('Affectation_heure_supp', {
    AFFECTATION_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    PROJET_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    COLLABORATEUR_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    TACHE: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    DATE_DEBUT: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    DATE_FIN: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    DATE_CREATION: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue:DataTypes.NOW
    },
    NBRE_JR_AFFECTATION	: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ID_VALIDATION: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    STATUS:{
      type: DataTypes.INTEGER,
      allowNull: true,
    }
}, {
    freezeTableName: true,
    tableName: 'affectation_heure_supp',
    timestamps: false
})

Affectation_heure_supp.belongsTo(Projets, { foreignKey: "PROJET_ID", as: "projets" })
Affectation_heure_supp.belongsTo(Collaborateurs, { as: "collaborateurs", foreignKey: "COLLABORATEUR_ID" });
Affectation_heure_supp.belongsTo(Validations, { as: "validations", foreignKey: "ID_VALIDATION" });
module.exports = Affectation_heure_supp   
