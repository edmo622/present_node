const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize');
const Outils_stock = require('./outils_stock');
const Outils_mediabox = require('./Outils_mediabox');

const Outils_attribution = sequelize.define('Outils_attribution', {
    ID_ATTRIBUTION: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    ID_OUTILS: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    ID_SOCK: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },


}, {
    freezeTableName: true,
    tableName: 'outils_stock_attribution',
    timestamps: false
})

Outils_attribution.belongsTo(Outils_stock, { foreignKey: "ID_SOCK", as: "Outils_stock" })
Outils_attribution.belongsTo(Outils_mediabox, { as: "outils_mediabox", foreignKey: "ID_OUTILS" });
module.exports = Outils_attribution      