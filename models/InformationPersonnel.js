const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");
const Json_identite = require("./Json_identite");
const Statut = require("../models/Statut")
const Genre = require("../models/Sexe")
const Profession = require("../models/Profession")
const Province = require("../models/Provinces")
const Commune = require("../models/Communes")
const Zone = require("../models/Zones")
const Colline = require("../models/Collines")

const information_personnel = sequelize.define(
  "information_personnel",
  {
    INFO_ID : {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    NOM: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PRENOM: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      NOM_PERE: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      NOM_MERE: {
        type: DataTypes.STRING,
        allowNull: false,
      },

PROVINCE_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
 
    },
    COMMUNE_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
   
      },
      ZONE_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
   
      },
      COLLINE: {
        type: DataTypes.INTEGER,
        allowNull: false,
   
      },
      DATE_NAISSANCE: {
      type: DataTypes.DATE,
      allowNull: false,
 
    },

ETAT_CIVIL_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,

  },
  SEXE_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,

  },
  PROFESSION_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  IMAGE: {
    type: DataTypes.STRING,
    allowNull: false,
  },
NUMERO: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  LIEU_LIVRAISON: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  DATE_LIVRAISON: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  NOM_DELIVRE_PAR: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  DEVICE_ID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  IS_DOUBLON: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  JSON_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
},
  {
    freezeTableName: true,
    tableName: "information_personnel",
    timestamps: false,
  }
);

/*
exemple modele pour enregistrer last_id
const Utilisateur = sequelize.define('Utilisateur', {
    nom: Sequelize.STRING,
    email: Sequelize.STRING
});

const Poste = sequelize.define('Poste', {
    titre: Sequelize.STRING,
    contenu: Sequelize.TEXT,
    utilisateurId: {
        type: Sequelize.INTEGER,
        references: {
            model: Utilisateur,
            key: 'id'
        }
    }
});

// Définir l'association entre Utilisateur et Poste
Utilisateur.hasMany(Poste, { foreignKey: 'utilisateurId' });
Poste.belongsTo(Utilisateur, { foreignKey: 'utilisateurId' });

*/

// information_personnel.belongsTo(Zones, { as: "zones", foreignKey: "ZONE_ID" });
information_personnel.belongsTo(Province, { as: "syst_provinces", foreignKey: "PROVINCE_ID" });
information_personnel.belongsTo(Commune, { as: "syst_communes", foreignKey: "COMMUNE_ID" });
information_personnel.belongsTo(Zone, { as: "syst_zones", foreignKey: "ZONE_ID" });
information_personnel.belongsTo(Colline, { as: "syst_collines", foreignKey: "COLLINE" });
information_personnel.belongsTo(Statut, { as: "statut", foreignKey: "ETAT_CIVIL_ID" });
information_personnel.belongsTo(Profession, { as: "profession", foreignKey: "PROFESSION_ID" });
information_personnel.belongsTo(Genre, { as: "genre", foreignKey: "SEXE_ID" });

module.exports =information_personnel;