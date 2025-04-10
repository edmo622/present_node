const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize');
const Equipe = require('./Equipes');

const Collaborateurs = sequelize.define('Collaborateurs', {
    COLLABORATEUR_ID : {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    NOM_PRENOM: {
        type: DataTypes.STRING(100),
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
    type: DataTypes.STRING(100),
    allowNull: false,
    },


}, {
    freezeTableName: true,
    tableName: 'collaborateurs',
    timestamps: false
})

Collaborateurs.belongsTo(Equipe, { as: "Equipe", foreignKey: "EQUIPE_ID" });
module.exports = Collaborateurs     