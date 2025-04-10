const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize');
const Affectations = require('./Affectation_heure_supp');


const Affectatin_declare = sequelize.define('Affectatin_declare', {
    ID_SUPP_DECL: {
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
      DATE_INSERTION: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue:DataTypes.NOW
    }
 

}, {
    freezeTableName: true,
    tableName: 'heure_supp_declare',
    timestamps: false
})

Affectatin_declare.belongsTo(Affectations, { as: "Affectations", foreignKey: "AFFECTATION_ID" });
module.exports = Affectatin_declare  