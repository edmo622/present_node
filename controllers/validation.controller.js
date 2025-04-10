const UtilisateurUpload = require("../class/uploads/UtilisateurUpload")
const IMAGES_DESTINATIONS = require("../constants/IMAGES_DESTINATIONS")
const path = require("path")
const { QueryTypes,DataTypes } = require('sequelize');
const sequelize = require("../utils/sequelize");
const { Op } = require("../utils/sequelize");
const Validation = require("../class/Validation")
const Utilisateur = require("../models/Utilisateurs")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const dotenv = require("dotenv")
const RESPONSE_CODES = require("../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../constants/RESPONSE_STATUS")
const Categories = require("../models/Categories")
const Outils_mediabox = require("../models/Outils_mediabox")
const Services = require("../models/Services")
const Outils_attribution = require("../models/outils_attribution")
const Outils_stock = require("../models/outils_stock")
const fs = require('fs');
const Outils_utilite = require("../models/outils_utilite")
const { Console } = require("console");
const { disconnect } = require("process");
const Collaborateurs = require("../models/Collaborateurs");
const Affectation_heure_supp = require("../models/Affectation_heure_supp");
const Validations = require("../models/Validations");

dotenv.config()


const creercategories = async (req, res) => {
  try {
      const { DESC_TYPE } = req.body;

      const data = {
          DESC_TYPE // Ajoutez d'autres champs si nécessaire
      };

      const validation = new Validation(data, {
          DESC_TYPE: {
              required: true,
              alpha: true,
              length: [2, 20]
          }
      }, {
          DESC_TYPE: {
              required: "Ce champ est obligatoire",
              alpha: "Le nom doit contenir des caractères alphanumériques",
              length: "Le nom doit comporter entre 2 et 20 caractères"
          }
      });

      await validation.run();
      const isValid = await validation.isValidate();

      if (!isValid) {
          const errors = await validation.getErrors();
          return res.status(422).json({
              message: "La validation des données a échoué",
              data: errors
          });
      }

      const nouveaucat = await Categories.create({
          DESC_TYPE: DESC_TYPE
      });

      res.status(200).json({
          message: "Nouvelle catégorie créée avec succès",
          data: nouveaucat
      });
  } catch (error) {
      console.log(error);
      res.status(500).send("Erreur interne du serveur");
  }
};
   

   const categorielist = async (req, res) => {
    try {
      const result = await Categories.findAll();
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "Profil",
        result: {
          data: result,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
        statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
        httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
        message: "Erreur interne du serveur, réessayer plus tard",
      });
    }
  };
  
  const createoutils_mediabox = async (req, res) => {
    try {
      const { ID_SERVICE,ID_TYPE_OUTILS,DESC_OUTILS,CODE_OUTILS } = req.body;
      const { IMAGE_OUTILS } = req.files || {}
   
      const data = { ...req.body,
                    ...req.files
      };
  
      const validation = new Validation(data, {
        DESC_OUTILS: {
          required: true,
          length: [1, 250],
        },
        CODE_OUTILS: {
          required: true,
          length: [1, 250],
          unique: "outils_mediabox,CODE_OUTILS",
        },
        ID_SERVICE: {
          required: true,
          exists:"service,ID_SERVICE"
        },
        ID_TYPE_OUTILS	: {
          required: true,
          exists:"types_outils,ID_TYPE_OUTILS	"
        },
        IMAGE_OUTILS: {
       required: true,
       image: 2000000
       },
        
      },
      {
        DESC_OUTILS: {
          required: "Ce champ est obligatoire",
          alpha: "Le Outil doit contenir des caractères alphanumériques",
          length: "Le Outil doit comporter entre 2 et 20 caractères",
          
        },
        CODE_OUTILS: {
          required: "Ce champ est obligatoire",
          alpha: "Le Code doit contenir des caractères alphanumériques",
          length: "Le Code doit comporter entre 2 et 20 caractères",
          unique:"Le Code existe deja",
        },
        ID_TYPE_OUTILS: {
          required: "Le Outil est obligatoire",
          exists: "Le Outil n'existe pas",
        },
        ID_SERVICE: {
          required: "Le Service est obligatoire",
          exists: "Le Service n'existe pas",
        },
        IMAGE_OUTILS: {
        required: "L'image de l'utilisateur est obligatoire",
        image: "L'image est valide",
        size: "Image trop volumineuse (max: 2Mo)"
        },
      } 
      );
      await validation.run();
      const isValid = await validation.isValidate();
      if (!isValid) {
        const errors = await validation.getErrors();
        return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
          statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
          httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
          message: "Probleme de validation des donnees",
          result: errors,
        });
      }
      const utilisateurUpload = new UtilisateurUpload()
      const fichier = await utilisateurUpload.upload(IMAGE_OUTILS)
      const imageUrl = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.utilisateurs}${path.sep}${fichier.fileInfo.fileName}`
      ID_SERVICE,ID_TYPE_OUTILS,DESC_OUTILS,CODE_OUTILS
      const outils_mediabox = await Outils_mediabox.create({
        CODE_OUTILS,
        DESC_OUTILS,
        ID_TYPE_OUTILS,
        ID_SERVICE,
        STATUT:1,
        IMAGE_OUTILS: imageUrl
      });
  
      res.status(RESPONSE_CODES.CREATED).json({
        statusCode: RESPONSE_CODES.CREATED,
        httpStatus: RESPONSE_STATUS.CREATED,
        message: "outils_mediabox a ete cree avec succes",
        result: outils_mediabox,
      });
  
    } catch (error) {
      console.log(error);
      res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
        statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
        httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
        message: "Erreur interne du serveur, réessayer plus tard",
      });
    }
  };
  const findAllCategories = async (req, res) => {
    try {
      const result = await Categories.findAll();
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "Profil",
        result: {
          data: result,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
        statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
        httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
        message: "Erreur interne du serveur, réessayer plus tard",
      });
    }
  };
  const findAllServices = async (req, res) => {
    try {
      const result = await Services.findAll();
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "Profil",
        result: {
          data: result,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
        statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
        httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
        message: "Erreur interne du serveur, réessayer plus tard",
      });
    }
  };


  const getOutilSequilize = async (req, res) => {
    try {
      const {service, rows = 10, first = 0, sortField, sortOrder, search } = req.query;
  
      const defaultSortDirection = "DESC";
      const sortColumns = {
        outils_mediabox: {
          as: "outils_mediabox",
          fields: {
            ID_OUTILS: "ID_OUTILS",
            DESC_OUTILS: "DESC_OUTILS",
            CODE_OUTILS: "CODE_OUTILS",
            ID_SERVICE: "ID_SERVICE",
            ID_TYPE_OUTILS: "ID_TYPE_OUTILS",
            STATUT: "STATUT",
            DATE_INSERTION: "DATE_INSERTION",
          },
        },
        categories: {
          as: "categories",
          fields: {
            ID_TYPE_OUTILS: "ID_TYPE_OUTILS",
            DESC_TYPE: "DESC_TYPE",
          },
        },
        services: {
          as: "services",
          fields: {
            ID_SERVICE: "ID_SERVICE",
            DESC_SERVICE	: "DESC_SERVICE	",
          },
        },
      };
      var orderColumn, orderDirection;
  
      // sorting
      var sortModel;
      if (sortField) {
        for (let key in sortColumns) {
          if (sortColumns[key].fields.hasOwnProperty(sortField)) {
            sortModel = {
              model: key,
              as: sortColumns[key].as,
            };
            orderColumn = sortColumns[key].fields[sortField];
            break;
          }
        }
      }
      if (!orderColumn || !sortModel) {
        // orderColumn = sortColumns.corporates.fields.ID_CORPORATE
        orderColumn = sortColumns.outils_mediabox.fields.DESC_OUTILS;
        sortModel = {
          model: "outils_mediabox",
          as: sortColumns.outils_mediabox,
        };
      }
      // ordering
      if (sortOrder == 1) {
        orderDirection = "ASC";
      } else if (sortOrder == -1) {
        orderDirection = "DESC";
      } else {
        orderDirection = defaultSortDirection;
      }
      
      // searching
      const globalSearchColumns = [
        "DESC_OUTILS",
        "CODE_OUTILS",
        "STATUT"
      ];
      var globalSearchWhereLike = {};
      if (search && search.trim() != "") {
        const searchWildCard = {};
        globalSearchColumns.forEach((column) => {
          searchWildCard[column] = {
            [Op.substring]: search,
          };
        });
        globalSearchWhereLike = {
          [Op.or]: searchWildCard,
        };
      }
      var serviceinfo = {}
      if (service) {
        serviceinfo = { ID_SERVICE: service }
      }
     
  
      const result = await Outils_mediabox.findAndCountAll({
        limit: parseInt(rows),
        offset: parseInt(first),
        order: [[sortModel, orderColumn, orderDirection]],
        where: {
          ...globalSearchWhereLike,
          ...serviceinfo
        },
        include: [{
          model:Categories,
          as: "categories",
          // attributes: ["ID_TYPE_OUTILS ", "DESC_TYPE"],
          required: false,
        },
        {
          model: Services,
          as: "services",
         // attributes: ["ID_SERVICE ", "DESC_SERVICE"],
          required: false,
        },
       
        ]
      });
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "Liste des outils",
        result: {
          data: result.rows,
          totalRecords: result.count,
          // totalRecords: result.rows.length,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
        statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
        httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
        message: "Erreur interne du serveur, réessayer plus tard",
      });
    }
  }; 

  const createOutilsAttribution = async (req, res) => {
    try {
        const { ID_SOCK, selectedOutils } = req.body;
      // return console.log(data,'les doooooooo')
        // Validation des données
        if (!ID_SOCK || !selectedOutils) {
            return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                message: "Problème de validation des données. ID_SOCK et selectedoutils sont requis."
            });
        }

        // Suppression des enregistrements existants pour ID_SOCK
        await Outils_attribution.destroy({ where: { ID_SOCK } });

        const allOutils = JSON.parse(selectedOutils);

        // Construction des données pour l'insertion
        const buildOutilsData = allOutils.map(outil => ({
            ID_OUTILS: outil,
            ID_SOCK
        }));
// return console.log(buildOutilsData,'jjjjjjjjjjj')
        // Insertion des nouvelles attributions
        await Outils_attribution.bulkCreate(buildOutilsData);

        // Réponse en cas de succès
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Attribution d'outils créée avec succès."
        });
    } catch (error) {
        console.error(error);
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, veuillez réessayer plus tard."
        });
    }
};

const findAllStock = async (req, res) => {
  try {
    const result = await Outils_stock.findAll();
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Outils_stock",
      result: {
        data: result,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
      message: "Erreur interne du serveur, réessayer plus tard",
    });
  }
};

const findAllOutils = async (req, res) => {
  try {
    const result = await Outils_mediabox.findAll();
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Outils_mediabox",
      result: {
        data: result,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
      message: "Erreur interne du serveur, réessayer plus tard",
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const data = JSON.parse(req.body);
// return console.log(data)
    if (Array.isArray(data)) {
      const new_utilite = [];

      for (const item of data) {
        if (item && item.DESCRIPTION && item.code && item.outil) {
          try {
            const createutilite = await Outils_utilite.create({
              DESCRIPTION: item.DESCRIPTION,
              ID_OUTILS: item.code
            });

            new_utilite.push(createutilite);
          } catch (error) {
            console.error("Erreur lors de la création de l'enregistrement:", error);
          }
        } else {
          console.error("Propriétés manquantes dans l'objet:", item);
        }
      }

      res.status(200).json({ message: 'Succès', data: new_utilite });
    } else {
      console.error("Les données ne sont pas au format attendu.");
      res.status(400).json({ error: 'Format de données invalide' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};



const getOutils_Service = async (req, res) => {
  const selectedCity = req.query.selectedCity;
  console.log(selectedCity, 'fgggfgggfggfgf');
  let replacements = [];
  let whereClause = "WHERE 1"; // Condition de base
  if (selectedCity) {
    whereClause += ` AND ID_TYPE_OUTILS=${selectedCity}`;
  }
    
  try {
    const result = await sequelize.query(`
      SELECT service.ID_SERVICE, DESC_SERVICE, COUNT(ID_OUTILS) AS NBR
      FROM service
      JOIN outils_mediabox ON outils_mediabox.ID_SERVICE = service.ID_SERVICE
      ${whereClause}
      GROUP BY service.ID_SERVICE, DESC_SERVICE`, {
        replacements,
        nest: true,
        type: QueryTypes.SELECT
      });

    const formattedData = result.map(item => ({
      name: item.DESC_SERVICE, // Utilisez les données appropriées pour 'name'
      y: item.NBR, // Utilisez les données appropriées pour 'y'
      key: item.ID_SERVICE // Utilisez les données appropriées pour 'key'
    })); // Ajout de la parenthèse fermante ici

    const totalRecords = formattedData.length;

    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "DONNEES REUSSI",
      result: formattedData,
      totalRecords,
    });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
      message: "Erreur interne du serveur, réessayer plus tard",
      error: error.message,
    });
  }
};
// POUR BCP DONNE
// const express = require('express');
// const app = express();
// const port = 3000; // Port sur lequel votre serveur écoutera

// app.get('/get_Outils_Service', (req, res) => {
//     // Récupérer les valeurs des paramètres de requête
//     const ID = req.query.ID;
//     const IDTYPE = req.query.IDTYPE;
//     const IDCT = req.query.IDCT;
//     const IDF = req.query.IDF;
//     const IR = req.query.IR;

//     // Utiliser les valeurs récupérées
//     console.log('ID:', ID);
//     console.log('IDTYPE:', IDTYPE);
//     console.log('IDCT:', IDCT);
//     console.log('IDF:', IDF);
//     console.log('IR:', IR);


// REQ BCK DONNE
// const baseURL = `/get_Outils_Service?selectedCity=${ID}&selectedType=${IDTYPE}&selectedCT=${IDCT}&selectedF=${IDF}&selectedR=${IR}`;


const getlistemodl = async (req, res) => {
  const selectedCity = req.query.selectedCity;
  console.log('rerrerererrerrrerrerererer',selectedCity, 'rerrerererrerrrerrerererer');
  var selectedCityWhere = {};
if (selectedCity) {
  selectedCityWhere = { ID_TYPE_OUTILS: selectedCity };
}
  try {
    const { ID_SERVICE } = req.params;
    if (!ID_SERVICE) {
      return res.status(RESPONSE_CODES.BAD_REQUEST).json({
        statusCode: RESPONSE_CODES.BAD_REQUEST,
        httpStatus: RESPONSE_STATUS.BAD_REQUEST,
        message: "ID_SERVICE is required.",
      });
    }

  
    const {service, rows = 10, first = 0, sortField, sortOrder, search } = req.query;

    const defaultSortDirection = "DESC";
    const sortColumns = {
      outils_mediabox: {
        as: "outils_mediabox",
        fields: {
          ID_OUTILS: "ID_OUTILS",
          DESC_OUTILS: "DESC_OUTILS",
          CODE_OUTILS: "CODE_OUTILS",
          ID_SERVICE: "ID_SERVICE",
          ID_TYPE_OUTILS: "ID_TYPE_OUTILS",
          STATUT: "STATUT",
          DATE_INSERTION: "DATE_INSERTION",
        },
      },
      categories: {
        as: "categories",
        fields: {
          ID_TYPE_OUTILS: "ID_TYPE_OUTILS",
          DESC_TYPE: "DESC_TYPE",
        },
      },
      services: {
        as: "services",
        fields: {
          ID_SERVICE: "ID_SERVICE",
          DESC_SERVICE	: "DESC_SERVICE	",
        },
      },
    };
    var orderColumn, orderDirection;

    // sorting
    var sortModel;
    if (sortField) {
      for (let key in sortColumns) {
        if (sortColumns[key].fields.hasOwnProperty(sortField)) {
          sortModel = {
            model: key,
            as: sortColumns[key].as,
          };
          orderColumn = sortColumns[key].fields[sortField];
          break;
        }
      }
    }
    if (!orderColumn || !sortModel) {
      // orderColumn = sortColumns.corporates.fields.ID_CORPORATE
      orderColumn = sortColumns.outils_mediabox.fields.DESC_OUTILS;
      sortModel = {
        model: "outils_mediabox",
        as: sortColumns.outils_mediabox,
      };
    }
    // ordering
    if (sortOrder == 1) {
      orderDirection = "ASC";
    } else if (sortOrder == -1) {
      orderDirection = "DESC";
    } else {
      orderDirection = defaultSortDirection;
    }
    
    // searching
    const globalSearchColumns = [
      "DESC_OUTILS",
      "CODE_OUTILS",
      "STATUT"
    ];
    var globalSearchWhereLike = {};
    if (search && search.trim() != "") {
      const searchWildCard = {};
      globalSearchColumns.forEach((column) => {
        searchWildCard[column] = {
          [Op.substring]: search,
        };
      });
      globalSearchWhereLike = {
        [Op.or]: searchWildCard,
      };
    }
    var serviceinfo = {}
    if (service) {
      serviceinfo = { ID_SERVICE: service }
    }
    

    const result = await Outils_mediabox.findAndCountAll({
      limit: parseInt(rows),
      offset: parseInt(first),
      order: [[sortModel, orderColumn, orderDirection]],
      where: {
        ID_SERVICE:ID_SERVICE,
        ...globalSearchWhereLike,
        ...serviceinfo,
        ...selectedCityWhere
      },
      include: [{
        model:Categories,
        as: "categories",
        // attributes: ["ID_TYPE_OUTILS ", "DESC_TYPE"],
        required: false,
      },
      {
        model: Services,
        as: "services",
       // attributes: ["ID_SERVICE ", "DESC_SERVICE"],
        required: false,
      },
     
      ]
    });
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Liste des outils",
      result: {
        data: result.rows,
        totalRecords: result.count,
        // totalRecords: result.rows.length,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
      message: "Erreur interne du serveur, réessayer plus tard",
    });
  }
}; 




const Liste_heure_sup = async (req, res) => {
  const profil = 2; // Remplacez ceci par req.query.profil si nécessaire
  const user_id = 1; // Remplacez ceci par req.query.user_id si nécessaire

  try {
    const { rows = 10, first = 0, sortField, sortOrder, search } = req.query;
    const defaultSortDirection = "DESC";
    const sortColumns = {
      affectation_heure_supp: {
        as: "affectation_heure_supp",
        fields: {
          AFFECTATION_ID: "AFFECTATION_ID",
          PROJET_ID: "PROJET_ID",
          COLLABORATEUR_ID: "COLLABORATEUR_ID",
          TACHE: "TACHE",
          DATE_DEBUT: "DATE_DEBUT",
          DATE_FIN: "DATE_FIN",
          NBRE_JR_AFFECTATION: "NBRE_JR_AFFECTATION",
          ID_VALIDATION: "ID_VALIDATION",
        },
      },
      validations: {
        as: "validations",
        fields: {
          ID_TYPE_OUTILS: "ID_VALIDATION",
          DESC_TYPE: "DESC_VALIDATION",
        },
      },
      Collaborateurs: {
        as: "Collaborateurs",
        fields: {
          ID_SERVICE: "COLLABORATEUR_ID",
          DESC_SERVICE: "NOM_PRENOM",
        },
      },
    };

    let orderColumn, orderDirection;
    let sortModel;

    if (sortField) {
      for (let key in sortColumns) {
        if (sortColumns[key].fields.hasOwnProperty(sortField)) {
          sortModel = {
            model: key,
            as: sortColumns[key].as,
          };
          orderColumn = sortColumns[key].fields[sortField];
          break;
        }
      }
    }

    if (!orderColumn || !sortModel) {
      orderColumn = sortColumns.affectation_heure_supp.fields.DATE_DEBUT;
      sortModel = {
        model: "affectation_heure_supp",
        as: sortColumns.affectation_heure_supp.as,
      };
    }

    console.log('orderColumn ID:', orderColumn);
    
    // Ordering
    orderDirection = (sortOrder == 1) ? "ASC" : (sortOrder == -1) ? "DESC" : defaultSortDirection;

    // Searching
    const globalSearchColumns = ["TACHE", "DATE_DEBUT", "DATE_FIN", "DATE_CREATION"];
    let globalSearchWhereLike = {};

    if (search && search.trim() !== "") {
      const searchWildCard = {};
      globalSearchColumns.forEach((column) => {
        searchWildCard[column] = {
          [Op.substring]: search,
        };
      });
      globalSearchWhereLike = {
        [Op.or]: searchWildCard,
      };
    }

    const result = await Affectation_heure_supp.findAndCountAll({
      limit: parseInt(rows),
      offset: parseInt(first),
      order: [[sortModel, orderColumn, orderDirection]],
      where: {
        ...globalSearchWhereLike,
        // ...selectedCityWhere // Assurez-vous d'inclure les conditions de sélection
      },
      include: [
        {
          model: Validations,
          as: "validations",
          attributes: ["ID_VALIDATION", "DESC_VALIDATION"],
          required: false,
        },
        {
          model: Collaborateurs,
          as: "collaborateurs",
          attributes: ["COLLABORATEUR_ID", "NOM_PRENOM"],
          required: false,
        },
      ]
    });

    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Liste des outils",
      result: {
        data: result,
        totalRecords: result.count,
      },
    });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) { // Vérifiez si une réponse a déjà été envoyée
      res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
        statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
        httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
        message: "Erreur interne du serveur, réessayer plus tard",
      });
    }
  }
};


module.exports = {
Liste_heure_sup,
creercategories,
categorielist,
createoutils_mediabox,
findAllCategories,
findAllServices,
getOutilSequilize,
createOutilsAttribution,
findAllStock,
findAllOutils,
getOutils_Service,
getlistemodl,
addToCart
}
   