const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize');
const Collaborateurs = require('./Collaborateurs');

const Projets = sequelize.define('Projets', {
    PROJET_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    PROJET_MANAGER_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    DESC_PROJET: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
     

}, {
    freezeTableName: true,
    tableName: 'projets',
    timestamps: false
})

Projets.belongsTo(Collaborateurs, { as: "collaborateurs", foreignKey: "PROJET_MANAGER_ID" });
module.exports = Projets  