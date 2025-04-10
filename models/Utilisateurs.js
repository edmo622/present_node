const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize');
const Profils = require('./Profils');
const Collines = require('./Collines');
const Utilisateurs = sequelize.define('utilisateurs', {
    ID_UTILISATEUR: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    NOM: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    PRENOM: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
  
 ID_PROFIL: {
            type: DataTypes.INTEGER,
            allowNull: false,
            },
            USERNAME: {
                type: DataTypes.STRING(50),
                    allowNull: false,
                },
                MOT_DE_PASSE: {
                    type: DataTypes.STRING(50),
                    allowNull: true,
                    defaultValue:null
                    },
                    IS_ACTIF: {
                        type: DataTypes.INTEGER,
                        allowNull: true,
                        defaultValue:null
                        },
                        TELEPHONE: {
                            type: DataTypes.INTEGER,
                            allowNull: true,
                            defaultValue:null
                            },
                    },
                     {
    freezeTableName: true,
    tableName: 'utilisateurs',
    timestamps: false
})
Utilisateurs.belongsTo(Profils,{foreignKey:"ID_PROFIL", as:"profil"})
module.exports = Utilisateurs