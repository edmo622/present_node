const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize');
const Affectations = require('./Affectation_heure_supp');
const Validations = require('./Validations');

const Histo_affectation = sequelize.define('Histo_affectation', {
    ID_HISTO_HEURE: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
AFFECTATION_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    COMMENTAIRE: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
    DATE_CREATION: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue:DataTypes.NOW
    },
    ID_VALIDATION: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    STATUS:{
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    USER_ID:{
      type: DataTypes.INTEGER,
      allowNull: true,
    }

}, {
    freezeTableName: true,
    tableName: 'histo_heure_sup',
    timestamps: false
})

Histo_affectation.belongsTo(Affectations, { as: "Affectations", foreignKey: "AFFECTATION_ID" });
Histo_affectation.belongsTo(Validations, { as: "validations", foreignKey: "ID_VALIDATION" });
module.exports = Histo_affectation   