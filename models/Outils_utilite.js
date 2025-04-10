const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize');
const Outils_mediabox = require('./Outils_mediabox');

const Outils_utilite = sequelize.define('outils_utilite', {
    ID_UTILITE: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    DESCRIPTION: {
        type: DataTypes.STRING(50),
        allowNull: false
    },

    ID_OUTILS: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },


}, {
    freezeTableName: true,
    tableName: 'outils_utilite',
    timestamps: false
})

Outils_utilite.belongsTo(Outils_mediabox, { as: "outils_mediabox", foreignKey: "ID_OUTILS" });
module.exports = Outils_utilite      