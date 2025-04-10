const UtilisateurUpload = require("../class/uploads/UtilisateurUpload")
const IMAGES_DESTINATIONS = require("../constants/IMAGES_DESTINATIONS")
const path = require("path")
const md5 = require('md5')
const { QueryTypes,DataTypes } = require('sequelize');
const sequelize = require("../utils/sequelize");
const { Op } = require("../utils/sequelize");
const Validation = require("../class/Validation")
const Utilisateur = require("../models/Utilisateurs")
const Profil = require("../models/Profils")
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
const Histo_affectation = require("../models/Histo_affectation");
const Affectatin_declare = require("../models/Affectatin_declare");
const { generateToken, verifyToken } = require('../utils/auth.utils');




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


// const getOutils_Service = async (req, res) => {
//   let replacements = [];
//   let whereClause = "WHERE 1"; // Condition de base

//   try {
//     const result = await sequelize.query(`
//       SELECT service.ID_SERVICE, DESC_SERVICE, COUNT(ID_OUTILS) AS NBR
//       FROM service
//       JOIN outils_mediabox ON outils_mediabox.ID_SERVICE = service.ID_SERVICE
//       ${whereClause}
//       GROUP BY service.ID_SERVICE, DESC_SERVICE`, {
//         replacements,
//         nest: true,
//         type: QueryTypes.SELECT
//       });

//     const totalRecords = result.length;

//     res.status(RESPONSE_CODES.OK).json({
//       statusCode: RESPONSE_CODES.OK,
//       httpStatus: RESPONSE_STATUS.OK,
//       message: "DONNEES REUSSI",
//       result: {
//         result,
//         totalRecords,
//       },
//     });
//   } catch (error) {
//     console.error('Database Error:', error);
//     res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
//       statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
//       httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
//       message: "Erreur interne du serveur, réessayer plus tard",
//       error: error.message,
//     });
//   }
// };

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


// const Liste_heure_sup = async (req, res) => {
// // const profil = req.query.profil;
// // const user_id = req.query.user_id;

//   try {
    
    
// const profil = 2;
// const user_id = 1;


// console.log('Profil:', profil);
// console.log('User ID:', user_id);


// let selectedCityWhere = {};

// if (profil && profil == '2') {
  
//     const groupes = await Collaborateurs.findOne({
//       attributes: ["EQUIPE_ID"],
//       where: { COLLABORATEUR_ID : user_id }
//     });
//     const groupe = groupes ? groupes.	EQUIPE_ID : null;
//     selectedCityWhere = {EQUIPE_ID: groupe };
//     res.status(200).json(groupe);
//     console.log('Groupe ID:', groupe);
    
// } else if (profil && profil == '3') {
//   selectedCityWhere = { COLLABORATEUR_ID : user_id };
// } else {
//   selectedCityWhere = {};
// }
//     const {rows = 10, first = 0, sortField, sortOrder, search } = req.query;

//     const defaultSortDirection = "DESC";
//     const sortColumns = {
//       affectation_heure_supp: {
//         as: "affectation_heure_supp",
//         fields: {
//           AFFECTATION_ID: "AFFECTATION_ID",
//           PROJET_ID: "PROJET_ID",
//           COLLABORATEUR_ID: "COLLABORATEUR_ID",
//           TACHE: "TACHE",
//           DATE_DEBUT: "DATE_DEBUT",
//           DATE_FIN: "DATE_FIN",
//           NBRE_JR_AFFECTATION: "NBRE_JR_AFFECTATION",
//           ID_VALIDATION: "ID_VALIDATION",
//         },
//       },
//       validations: {
//         as: "validations",
//         fields: {
//           ID_TYPE_OUTILS: "ID_VALIDATION",
//           DESC_TYPE: "DESC_VALIDATION",
//         },
//       },
//       Collaborateurs: {
//         as: "Collaborateurs",
//         fields: {
//           ID_SERVICE: "COLLABORATEUR_ID",
//           DESC_SERVICE	: "NOM_PRENOM	",
//         },
//       },
//     };
//     var orderColumn, orderDirection;
//     var sortModel;
//     if (sortField) {
//       for (let key in sortColumns) {
//         if (sortColumns[key].fields.hasOwnProperty(sortField)) {
//           sortModel = {
//             model: key,
//             as: sortColumns[key].as,
//           };
//           orderColumn = sortColumns[key].fields[sortField];
//           break;
//         }
//       }
//     }
  
//     if (!orderColumn || !sortModel) {
//       // orderColumn = sortColumns.corporates.fields.ID_CORPORATE
//       orderColumn = sortColumns.affectation_heure_supp.fields.DATE_DEBUT;
//       sortModel = {
//         model: "affectation_heure_supp",
//         as: sortColumns.affectation_heure_supp,
//       };
//     }
//     console.log('orderColumn ID:', orderColumn);
//     // ordering
//     if (sortOrder == 1) {
//       orderDirection = "ASC";
//     } else if (sortOrder == -1) {
//       orderDirection = "DESC";
//     } else {
//       orderDirection = defaultSortDirection;
//     }
    
//     // searching
//     const globalSearchColumns = [
//       "TACHE",
//       "DATE_DEBUT",
//       "DATE_FIN",
//       "DATE_CREATION"
//     ];

//     var globalSearchWhereLike = {};
//     if (search && search.trim() != "") {
//       const searchWildCard = {};
//       globalSearchColumns.forEach((column) => {
//         searchWildCard[column] = {
//           [Op.substring]: search,
//         };
//       });
//       globalSearchWhereLike = {
//         [Op.or]: searchWildCard,
//       };
//     }
    
    

//     const result = await Affectation_heure_supp.findAndCountAll({
//       limit: parseInt(rows),
//       offset: parseInt(first),
//       order: [[sortModel, orderColumn, orderDirection]],
//       where: {
//         ...globalSearchWhereLike
//       },
//       include: [{
//         model:Validations,
//         as: "validations",
//         attributes: ["ID_VALIDATION", "DESC_VALIDATION"],
//         required: false,
//       },
//       {
//         model: Collaborateurs,
//         as: "collaborateurs",
//        attributes: ["COLLABORATEUR_ID", "NOM_PRENOM"],
//       //  where: {
//       //   ...selectedCityWhere
//       // },
//         required: false,
//       },
     
//       ]
//     });

//     // return console.log(result,'les doneess')
//     res.status(RESPONSE_CODES.OK).json({
//       statusCode: RESPONSE_CODES.OK,
//       httpStatus: RESPONSE_STATUS.OK,
//       message: "Liste des outils",
//       result: {
//         data: result,
//         totalRecords: result.count,
//         // totalRecords: result.rows.length,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
//       statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
//       httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
//       message: "Erreur interne du serveur, réessayer plus tard",
//     });
//   }
// }; 

const Liste_heure_sup = async (req, res) => {
  const profil = 2; // Remplacez ceci par req.query.profil si nécessaire
  const user_id = 1; // Remplacez ceci par req.query.user_id si nécessaire

  // console.log('Profil:', profil);
  // console.log('User ID:', user_id);

  // let selectedCityWhere = {};

  // if (profil && profil == '2') {
  //   try {
  //     const groupes = await Collaborateurs.findOne({
  //       attributes: ["EQUIPE_ID"],
  //       where: { COLLABORATEUR_ID: user_id }
  //     });
  //     const groupe = groupes ? groupes.EQUIPE_ID : null;
  //     selectedCityWhere = { EQUIPE_ID: groupe };
      
  //     // Réponse pour le profil 2
  //     res.status(200).json(groupe);
  //     console.log('Groupe ID:', groupe);
  //     return; // Stoppe l'exécution ici
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).send("Erreur interne du serveur");
  //   }
  // } else if (profil && profil == '3') {
  //   selectedCityWhere = { COLLABORATEUR_ID: user_id };
  // } else {
  //   selectedCityWhere = {};
  // }

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

const updateUtil = async (req, res) => {
  
  try {
  
    const {AFFECTATION_ID, PROFIL_ID,validationStatus,comment } = req.body;
    const data = { ...req.body }
    console.log(data,'edmondgoo')
    const validation = new Validation(data, {
      AFFECTATION_ID: {
        required: true,
        length: [1, 250],
      },
      PROFIL_ID: {
        required: true,
        length: [1, 250],
      },
      comment: {
        required: false,
        length: [1, 5000],
      },
      validationStatus: {
        required: true,
        length: [1, 250],
      }, 
    },
    {
      comment: {
        required: "Ce champ est obligatoire",
        alpha: "Le nom doit contenir des caractères alphanumériques",
        length: "Le nom doit comporter entre 2 et 500 caractères",
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
    const DATE_CREATION = new Date();
    const STATUS = 2;
    console.log(comment,'ggggggggggggggg')
    const utilisateur = await Histo_affectation.create({
      AFFECTATION_ID: AFFECTATION_ID,
      ID_VALIDATION:validationStatus,
      COMMENTAIRE:comment,
      USER_ID:PROFIL_ID,
      STATUS:STATUS,
      DATE_CREATION:DATE_CREATION,
    
  });
  if (STATUS === 2) {
    // Créer une entrée dans la table Affectatin_declare
    const decl = await Affectatin_declare.create({
        AFFECTATION_ID: AFFECTATION_ID,
        COMMENTAIRE: comment,
        DATE_INSERTION: DATE_CREATION,
    });

    console.log('Entrée créée dans Affectatin_declare:', decl);
}

    
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.CREATED,
      message: "L'Action est faite avec succes",
      result: {
        utilisateur,
      }
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
const creerUtilisateur = async (req, res) => {
  try {
  const { NOM, PRENOM, ID_PROFIL, EMAIL, MOT_DE_PASSE,COLLINE_ID } = req.body
  // console.log(req.body);
  const { IMAGE } = req.files || {}
  const data = {
  ...req.body,
  ...req.files
  }
  const validation = new Validation(data, {
  NOM: {
  required: true,
  alpha: true,
  length: [2, 20]
  },
  PRENOM: {
  required: true,
  alpha: true,
  length: [2, 20]
  },
  ID_PROFIL: {
  required: true,
  number: true,
  // exists: "profils,ID_PROFIL"
  },
  COLLINE_ID: {
    required: true,
    number: true,
    },
  
  // IMAGE: {
  // required: true,
  // image: 2000000
  // },
  EMAIL: {
  required: true,
  email: true,
  unique: "utilisateurs,EMAIL"
  },
  MOT_DE_PASSE: {
  required: true,
  length: [8]
  }
  }, {
  NOM: {
  required: "Ce champ est obligatoire",
  alpha: "Le nom doit contenir des caractères alphanumériques",
  length: "Le nom doit comporter entre 2 et 20 caractères"
  },
  PRENOM: {
  required: "Ce champ est obligatoire",
  alpha: "Le prénom doit contenir des caractères alphanumériques",
  length: "Le prénom doit comporter entre 2 et 20 caractères"
  },
  ID_PROFIL: {
  required: "Le profil est obligatoire",
  number: "Ce champ doit contenir un nombre valide",
  exists: "Le profil n'existe pas"
  },
  COLLINE_ID: {
    required: "Le coline est obligatoire",
    number: "Ce champ doit contenir un nombre valide",
    exists: "Le coline n'existe pas"
    },
  // IMAGE: {
  // required: "L'image de l'utilisateur est obligatoire",
  // image: "L'image est valide",
  // size: "Image trop volumineuse (max: 2Mo)"
  // },
  EMAIL: {
  required: "L'email est obligatoire",
  email: "Email invalide",
  unique: "Email déjà utilisé"
  },
  MOT_DE_PASSE: {
  required: "Le mot de passe est obligatoire",
  length: "Le mot de passe doit contenir au moins 8 caracteres"
  }
  })
  await validation.run()
  const isValid = await validation.isValidate()
  if(!isValid) {
  const errors = await validation.getErrors()
  return res.status(422).json({
  message: "La validation des données a echouée",
  data: errors
  })
  }
  // const utilisateurUpload = new UtilisateurUpload()
  // const fichier = await utilisateurUpload.upload(IMAGE)
  // const imageUrl = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.utilisateurs}${path.sep}${fichier.fileInfo.fileName}`
  const salt = await bcrypt.genSalt()
  const password = await bcrypt.hash(MOT_DE_PASSE, salt)
  console.log(NOM,PRENOM,ID_PROFIL,EMAIL,password,COLLINE_ID);
  const nouveauUtilisateur = await Utilisateur.create({
  NOM: NOM,
  PRENOM: PRENOM,
  ID_PROFIL: ID_PROFIL,
  COLLINE_ID: COLLINE_ID,
  // IMAGE: imageUrl,
  EMAIL: EMAIL,
  MOT_DE_PASSE: password
  })
  const payload = {
  ID_UTILISATEUR: nouveauUtilisateur.toJSON().ID_UTILISATEUR
  }
  const accessToken = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, { expiresIn: 259200 })
  const { MOT_DE_PASSE: mdp, ...public } = nouveauUtilisateur.toJSON()
  res.status(200).json({
  message: "Nouvel utilisateur créé avec succès",
  data: {
  ...public,
 token: accessToken
  }
  })
  } catch (error) {
  console.log(error)
  res.status(500).send("Erreur interne du serveur")
  }
 }

 const login = async (req, res) => {
  try {
    const { EMAIL, MOTPASS } = req.body;

    // Validation des entrées
    const validation = new Validation(
      req.body,
      
      {
        EMAIL: {
          required: true,
          email: true
        },
        MOTPASS: "required", // Maintenant cohérent avec la destructuring
      },
      {
        MOTPASS: { // Correction: même nom partout
          required: "Le mot de passe est obligatoire",
        },
        EMAIL: {
          required: "L'email est obligatoire",
          email: "Email invalide",
        },
      }
    );

    await validation.run();

    if (!await validation.isValidate()) {
      return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
        statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
        httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
        message: "Erreur de validation",
        result: await validation.getErrors(),
      });
    }

    // Recherche de l'utilisateur
    const user = await Utilisateur.findOne({
      where: { USERNAME: EMAIL },
      attributes: [
        "ID_UTILISATEUR",
        "ID_PROFIL",
        "USERNAME",
        "PRENOM",
        "NOM",
        "MOT_DE_PASSE",
        "TELEPHONE",
        "IS_ACTIF",
      ],
      include: [{
        model: Profil,
        as: "profil",
        required: false,
        attributes: ["STATUT", "ID_PROFIL"],
      }],
    });

    if (!user) {
      return res.status(RESPONSE_CODES.UNAUTHORIZED).json({
        statusCode: RESPONSE_CODES.UNAUTHORIZED,
        httpStatus: RESPONSE_STATUS.UNAUTHORIZED,
        message: "Identifiants incorrects",
      });
    }

    if (user.IS_ACTIF === 0) {
      return res.status(RESPONSE_CODES.FORBIDDEN).json({
        statusCode: RESPONSE_CODES.FORBIDDEN,
        httpStatus: RESPONSE_STATUS.FORBIDDEN,
        message: "Ce compte est désactivé",
      });
    }
    if (!MOTPASS || typeof MOTPASS !== 'string') {
      return res.status(400).json({
        statusCode: 400,
        message: "Le mot de passe est requis et doit être une chaîne de caractères"
      });
    }
    // Vérification mot de passe
    if (user.MOT_DE_PASSE !== md5(MOTPASS)) {
      return res.status(RESPONSE_CODES.UNAUTHORIZED).json({
        statusCode: RESPONSE_CODES.UNAUTHORIZED,
        httpStatus: RESPONSE_STATUS.UNAUTHORIZED,
        message: "Identifiants incorrects",
      });
    }

    // Génération du token
    const tokenPayload = {
      user: {
        ID_UTILISATEUR: user.ID_UTILISATEUR,
        ID_PROFIL: user.ID_PROFIL,
        USERNAME: user.USERNAME,
        PRENOM: user.PRENOM,
        NOM: user.NOM,
        TELEPHONE: user.TELEPHONE,
      },
      access: user.profil ? user.profil.dataValues : null,
    };

    const token = generateToken(tokenPayload, 3 * 12 * 30 * 24 * 3600);

    // Réponse réussie
    const { MOTPASS: _, ...userData } = user.dataValues; // Exclusion explicite du mot de passe
    return res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Connexion réussie",
      result: {
        user: userData,
        token: token,
      },
    });

  } catch (error) {
    console.error("Erreur login:", error);
    return res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
      message: "Erreur interne du serveur",
    });
  }
};


module.exports = {
Liste_heure_sup,
login,
updateUtil,
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
addToCart,
creerUtilisateur
}
   