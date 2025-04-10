const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize');
const Categories = require('./Categories');
const Services = require('./Services');
const Outils_mediabox = sequelize.define('Outils_mediabox', {
    ID_OUTILS: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    DESC_OUTILS: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    CODE_OUTILS: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    IMAGE_OUTILS: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
        },
    

        ID_SERVICE: {
            type: DataTypes.INTEGER,
            allowNull: false,
            },
            
            ID_TYPE_OUTILS: {
                        type: DataTypes.INTEGER,
                        allowNull: false,
                        },

                        STATUT: {
                            type: DataTypes.INTEGER,
                            allowNull: true,
                            },
                    

                        
}, {
    freezeTableName: true,
    tableName: 'outils_mediabox',
    timestamps: false
})

Outils_mediabox.belongsTo(Categories,{foreignKey:"ID_TYPE_OUTILS", as:"categories"})
Outils_mediabox.belongsTo(Services, { as: "services", foreignKey: "ID_SERVICE" });
module.exports = Outils_mediabox      