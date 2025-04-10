
const path = require("path")
const Validation = require("../class/Validation")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const dotenv = require("dotenv")
const RESPONSE_CODES = require("../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../constants/RESPONSE_STATUS")
const Categories = require("../models/Categories")
const DeclararionHS = require("../models/DeclarationHS")
// const AffectationHS = require("../models/AffectationHS")
// const CollaborateurHS = require("../models/CollaborateurHS")
const Projets = require("../models/Projets")
const HistoriqueHS = require("../models/HistoriqueHS")
const Equipe = require("../models/Equipes")
// const session = require('express-session');

dotenv.config()


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
  
  const SaveHS = async (req, res) => {
    try {
      // const { AFFECTATION_ID,COMMENTAIRE,ID_VALIDATION,STATUS,USER_ID } = req.body;
      const { AFFECTATION_ID,COMMENTAIRE } = req.body;
      const data = { ...req.body};
      const validation = new Validation(data, {

        AFFECTATION_ID	: {
          required: true,
          number:true,
          exists:"affectation_heure_supp,AFFECTATION_ID	",
          unique: "heure_supp_declare,AFFECTATION_ID",
        },

        COMMENTAIRE	: {
          required: true,
          length: [2, 220],
        },
        
      },
      {
        
        AFFECTATION_ID: {
          required: "Ce champ est obligatoire",
          unique: "Vous avez déjà déclaré sur cette tâche",
           exists: "L'affectation n'existe pas",
        },
        COMMENTAIRE: {
          required: "Ce champ est obligatoire",
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
          message: "Problème de validation des données",
          result: errors,
        });
      }

      const dataHS = await DeclararionHS.create({
        AFFECTATION_ID,
        COMMENTAIRE    
      });

      console.log("vvvvvvvv",dataHS);
  
      res.status(RESPONSE_CODES.CREATED).json({
        statusCode: RESPONSE_CODES.CREATED,
        httpStatus: RESPONSE_STATUS.CREATED,
        message: "Heure supplémentaire a été enregistrée avec succès",
        result: dataHS,
      });


      const dataUpdate = await AffectationHS.update({ STATUS: 2 }, { where: { AFFECTATION_ID: AFFECTATION_ID } });
      console.log("Mise à jour du statut réussie:", dataUpdate);
  
    } catch (error) {
      console.log(error);
      res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
        statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
        httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
        message: "Erreur interne du serveur, réessayer plus tard",
      });
    }
  };


  const get_projets = async (req, res) => {
    const data = {
      ...req.body,
      ...req.files,
    }

  
    try {
      const result = await Projets.findAll();
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "Projets",
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

  const get_equipe = async (req, res) => {
    const data = {
      ...req.body,
      ...req.files,
    }

  
    try {
      const result = await Equipe.findAll();
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "equipe",
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


  const get_collaborateur = async (req, res) => {
    const data = {
      ...req.body,
      ...req.files,
      ...req.session 
    }
   
    const session = req.session;
    console.log( "session",session);
  
    try {
      const result = await CollaborateurHS.findAll();
      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "Colloborateur",
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



  const get_tache = async (req, res) => {
    const { COLLABORATEUR_ID } = req.params;
    // const { COLLABORATEUR_ID } = 1;

    const data = {
      ...req.body
    }
  
    try {
      const result = await AffectationHS.findAll(  { where: { COLLABORATEUR_ID : COLLABORATEUR_ID }});
      // const result = await AffectationHS.findAll();

      res.status(RESPONSE_CODES.OK).json({
        statusCode: RESPONSE_CODES.OK,
        httpStatus: RESPONSE_STATUS.OK,
        message: "Tache",
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

  const getOne_suicide = async (req, res) => {
    try {
      const { AFFECTATION_ID } = req.params;
      const cni = await DeclararionHS.findOne({
        where: {
          AFFECTATION_ID
        },
        // include: [
        //   {
        //     model: Profession,
        //     as: "profession",
        //     required: false
        //   },
        //   {
        //     model: Sexe,
        //     as: "genre",
        //     required: false
        //   },
        //   {
        //     model: Statut,
        //     as: "statut",
        //     required: false
        //   },
        //   {
        //     model: Province,
        //     as: "syst_provinces",
        //     required: false
        //   },
        //   {
        //     model: Commune,
        //     as: "syst_communes",
        //     required: false
        //   },
        //   {
        //     model: Zone,
        //     as: "syst_zones",
        //     required: false
        //   },
        //   {
        //     model: Colline,
        //     as: "syst_collines",
        //     required: false
        //   },
        // ]
      });
         
console.log(cni);
if (cni) {
  res.status(RESPONSE_CODES.OK).json({
    statusCode: RESPONSE_CODES.OK,
    httpStatus: RESPONSE_STATUS.OK,
    message: "Données",
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




module.exports = {
    SaveHS,
    get_tache,
    get_collaborateur,
    get_projets,
    get_equipe,
    getOne_suicide
}
   
