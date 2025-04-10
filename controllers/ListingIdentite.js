const UtilisateurUpload = require("../class/uploads/UtilisateurUpload")
const path = require("path")
const RESPONSE_CODES = require("../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../constants/RESPONSE_STATUS")
const IMAGES_DESTINATIONS = require("../constants/IMAGES_DESTINATIONS");

const Statut = require("../models/Statut")
const infoperso = require("../models/InformationPersonnel")
// const Genre = require("../models/Sexe")
const Profession = require("../models/Profession")
const Province = require("../models/Provinces")
const Commune = require("../models/Communes")
const Zone = require("../models/Zones")
const Colline = require("../models/Collines")
const dotenv = require("dotenv")
const Sexe = require("../models/Sexe");
const { Where } = require("sequelize/lib/utils");
const { where } = require("sequelize");
const DeclararionHS = require("../models/DeclarationHS");

dotenv.config()



const supprimerInfoCNI = async (req, res) => {
  const { INFO_ID } = req.params;

  try {
    const rowsDeleted = await infoperso.destroy({ where: { INFO_ID: INFO_ID } });

    if (rowsDeleted > 0) {
      res.json({ message: `L'élement avec INFO_ID égal à ${INFO_ID} a été supprimé.` });
    } else {
      res.status(404).json({ message: `Aucun élement avec INFO_ID égal à ${INFO_ID} n'a été trouvé.` });
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'élement :', error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la suppression.' });
  }
};


const listing2 = async (req, res) => {
  try {
    const { profile, rows = 10, first = 0, sortField, sortOrder, search } = req.query;

    // const defaultSortField = "DATE_INSERTION";
    const defaultSortDirection = "DESC";
    const sortColumns = {
      infoperso: {
        as: "infoperso",
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
      Sexe: {
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
        as: "statuts",
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
      orderColumn = sortColumns.infoperso.fields.INFO_ID;
      sortModel = {
        model: "infoperso",
        as: sortColumns.infoperso,
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

    // return console.log(result)
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


const updateOdk = async (req, res) => {
  try {
    const { INFO_ID } = req.params;
    const { NOM, PRENOM, NOM_PERE, NOM_MERE, PROVINCE_ID, COMMUNE_ID, ZONE_ID, COLLINE, DATE_NAISSANCE, ETAT_CIVIL_ID, SEXE_ID, PROFESSION_ID, NUMERO, LIEU_LIVRAISON, DATE_LIVRAISON, NOM_DELIVRE_PAR, JSON_ID } = req.body;
    const { IMAGE } = req.files || {}
    const data = {
      ...req.body,
      ...req.files
    }

// console.log("fffffffffffff",data)
    const utilisateurUpload = new UtilisateurUpload()
    const fichier = await utilisateurUpload.upload(IMAGE)
    console.log("test id",data)
    const imageUrl = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.utilisateurs}${path.sep}${fichier.fileInfo.fileName}`

    const cni = await infoperso.update(
      {
        NOM,
        PRENOM,
        NOM_PERE,
        NOM_MERE,
        PROVINCE_ID,
        COMMUNE_ID,
        ZONE_ID,
        COLLINE,
        DATE_NAISSANCE,
        ETAT_CIVIL_ID,
        SEXE_ID,
        PROFESSION_ID,
        IMAGE: imageUrl,
        NUMERO,
        LIEU_LIVRAISON,
        DATE_LIVRAISON,
        NOM_DELIVRE_PAR

      },
      {
        where: {
          INFO_ID: INFO_ID,
        },
      }
    );

    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Modification est faite avec succes",
      result: {
        cni,
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

const getOne = async (req, res) => {
  try {
    const { INFO_ID } = req.params;
    const cni = await infoperso.findOne({
      where: {
        INFO_ID,
      },
      include: [
        {
          model: Profession,
          as: "profession",
          required: false
        },
        {
          model: Sexe,
          as: "genre",
          required: false
        },
        {
          model: Statut,
          as: "statut",
          required: false
        },
        {
          model: Province,
          as: "syst_provinces",
          required: false
        },
        {
          model: Commune,
          as: "syst_communes",
          required: false
        },
        {
          model: Zone,
          as: "syst_zones",
          required: false
        },
        {
          model: Colline,
          as: "syst_collines",
          required: false
        },
      ]
    });
    
console.log(cni);
    if (cni) {
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "presence de données",
        result: cni,
      });
    } else {
      res.status(RESPONSE_CODES.NOT_FOUND).json({
        statusCode: RESPONSE_CODES.NOT_FOUND,
        httpStatus: RESPONSE_STATUS.NOT_FOUND,
        message: "données non trouve",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
      message: "Erreur interne du serveur, réessayer plus tard",
    });
  }
};




const getSexe = async (req, res) => {
  try {
    const result = await Sexe.findAll();
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Sexe",
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

const getProfession = async (req, res) => {
  try {
    const result = await Profession.findAll();
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Profession",
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

const getProvince = async (req, res) => {
  try {
    const result = await Province.findAll();
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Provinces",
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

const getCommune = async (req, res) => {

  const { PROVINCE_ID } = req.params;

  const data = {
    ...req.body,
    ...req.files
  }

  try {
    const result = await Commune.findAll(  { where: { PROVINCE_ID : PROVINCE_ID }});
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Commune",
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

const getZone = async (req, res) => {
  const { COMMUNE_ID } = req.params;

  const data = {
    ...req.body,
    ...req.files
  }

  try {
    const result = await Zone.findAll(  { where: { COMMUNE_ID : COMMUNE_ID }});
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Zone",
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

const getColline = async (req, res) => {
  const { ZONE_ID } = req.params;

  const data = {
    ...req.body,
    ...req.files
  }

  try {
    const result = await Colline.findAll(  { where: { ZONE_ID : ZONE_ID }});
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Colline",
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


const getStatut = async (req, res) => {
  try {
    const result = await Statut.findAll();
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.OK,
      message: "Statut",
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


module.exports = {
  listing2,
  updateOdk,
  getOne,
  getSexe,
  getProfession,
  getProvince,
  getStatut,
  getCommune,
  getZone,
  getColline,
  supprimerInfoCNI
};
