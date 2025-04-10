const infoperso = require("../models/InformationPersonnel")
const Statut = require("../models/Statut")
const Genre = require("../models/Sexe")
const Profession = require("../models/Profession")
const Province = require("../models/Provinces")
const Commune = require("../models/Communes")
const Zone = require("../models/Zones")
const Colline = require("../models/Collines")
const RESPONSE_CODES = require("../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../constants/RESPONSE_STATUS")
// const IMAGES_DESTINATIONS = require("../constants/IMAGES_DESTINATIONS");
const path = require("path");
const dotenv = require("dotenv")
const Sexe = require("../models/Sexe")


// const auth_routes = require("../routes/auth.routes")
dotenv.config()


const listing2 = async (req, res) => {
    try {
      const { profile, rows = 10, first = 0, sortField, sortOrder, search } = req.query;
  
      // const defaultSortField = "DATE_INSERTION";
      const defaultSortDirection = "DESC";
      const sortColumns = {
        information_personnel: {
          as: "information_personnel",
          fields: {
            INFO_ID: "INFO_ID",
            NOM: "NOM",
            PRENOM: "PRENOM",
            NOM_PERE: "NOM_PERE",
            NOM_MERE: "NOM_MERE",
            PROVINCE_ID: "PROVINCE_ID",
            COMMUNE_ID: "COMMUNE_ID",
            ZONE_ID: "ZONE_ID",
            COLLINE: "COLLINE",
            DATE_NAISSANCE: "DATE_NAISSANCE",
            ETAT_CIVIL_ID: "ETAT_CIVIL_ID",
            PROFESSION_ID: "PROFESSION_ID",
            SEXE_ID: "SEXE_ID",
            IMAGE: "IMAGE",
            NUMERO: "NUMERO",
            LIEU_LIVRAISON: "LIEU_LIVRAISON",
            DATE_LIVRAISON: "DATE_LIVRAISON",
            NOM_DELIVRE_PAR: "NOM_DELIVRE_PAR",
          },
        },
        Genre: {
          as: "genre",
          fields: {
            ID_PROFIL: "SEXE_ID",
            DESCRIPTION: "DESCRIPTION",
          },
        },
          Profession: {
          as: "profession",
          fields: {
            PROFESSION_ID: "PROFESSION_ID",
            DESCRIPTION: "DESCRIPTION",
          },
        },
          Statut: {
          as: "statut",
          fields: {
            ETAT_CIVIL_ID: "STATUT_ID",
            DESCRIPTION: "DESCRIPTION",
          },
        },
          Province: {
          as: "syst_provinces",
          fields: {
            ETAT_CIVIL_ID: "PROVINCE_ID",
            DESCRIPTION: "DESCRIPTION",
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
        orderColumn = sortColumns.information_personnel.fields.INFO_ID;
        sortModel = {
          model: "InformtionPersonnel",
          as: sortColumns.information_personnel,
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
        "NOM",
        "PRENOM",
        "NOM_PERE",
        "NOM_MERE",
        "$sexe.DESCRIPTION$",
        "$profession.DESCRIPTION$",
        "$statut.DESCRIPTION$",
        "$syst_provinces.DESCRIPTION$",
        "$syst_communes.DESCRIPTION$",
        "$syst_zones.DESCRIPTION$",
        "$syst_collines.DESCRIPTION$",

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
      var profileinfo = {}
      if (profile) {
        profileinfo = { INFO_ID: infoperso }
      }
  
      const result = await infoperso.findAndCountAll({
        limit: parseInt(rows),
        offset: parseInt(first),
        order: [[sortModel, orderColumn, orderDirection]],
        where: {
          ...globalSearchWhereLike,
          ...profileinfo
        },
        include: [{
          model: Profession,
          as: "profession",
          attributes: ["PROFESSION_ID", "DESCRIPTION"],
          required: false,
        },
        {
            model: Sexe,
            as: "genre",
            attributes: ["SEXE_ID", "DESCRIPTION"],
            required: false,
          },

          {
            model: Statut,
            as: "statut",
            attributes: ["STATUT_ID", "DESCRIPTION"],
            required: false,
          },

          {
            model: Province,
            as: "syst_provinces",
            attributes: ["PROVINCE_ID", "PROVINCE_NAME"],
            required: false,
          },

          {
            model: Commune,
            as: "syst_communes",
            attributes: ["COMMUNE_ID", "COMMUNE_NAME"],
            required: false,
          },

          {
            model: Zone,
            as: "syst_zones",
            attributes: ["ZONE_ID", "ZONE_NAME"],
            required: false,
          },

          {
            model: Colline,
            as: "syst_collines",
            attributes: ["COLLINE_ID", "COLLINE_NAME"],
            required: false,
          },
        ]
      });
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "Liste",
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

module.exports = {
    listing2
};