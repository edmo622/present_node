const Affectation_heure_supp = require("../models/Affectation_heure_supp");
const Validations = require("../models/Validations");
const Collaborateurs = require("../models/Collaborateurs");
const Equipes = require("../models/Equipes");
const Projets = require('../models/Projets');
const Validation = require("../class/Validation")

// dotenv.config()

const creerAffectation = async (req, res) => {
    try {
        const { PROJET_ID,COLLABORATEUR_ID,TACHE,DATE_DEBUT,DATE_FIN } = req.body;

        const dateDebut = new Date(DATE_DEBUT);
const dateFin = new Date(DATE_FIN);
const differenceEnJours = Math.round((dateFin - dateDebut) / (1000 * 3600 * 24));
        const data = { 
            PROJET_ID,COLLABORATEUR_ID,TACHE,DATE_DEBUT,DATE_FIN,NBRE_JR_AFFECTATION: differenceEnJours
        };
    console.log('remeo',data)
        const validation = new Validation(data, {
            PROJET_ID: {
                required: true,
                exists:"projets,PROJET_ID"
            },
            COLLABORATEUR_ID: {
                required: true,
                exists:"collaborateurs,COLLABORATEUR_ID"
            },
            TACHE: {
                required: true,
                length: [1, 250],
            },
            DATE_DEBUT: {
                required: true,
            },
            DATE_FIN: {
                required: true,
            },
            NBRE_JR_AFFECTATION:{
                required: true,
            }
        }, {
            PROJET_ID: {
                required: "Le projet est obligatoire",
                exists: "Le projet n'existe pas",
            },
            COLLABORATEUR_ID: {
                required: "Le projet est obligatoire",
                exists: "Le projet n'existe pas",
            },
            TACHE: {
                required: "Ce champ est obligatoire",
                alpha: "La tache doit contenir des caractères alphanumériques",
                length: "La tache doit comporter entre 2 et 20 caractères",
            },
            DATE_DEBUT: {
                required: "Ce champ est obligatoire",
            },
            DATE_FIN: {
                required: "Ce champ est obligatoire",
            },
            NBRE_JR_AFFECTATION:{
                required: "Ce champ est obligatoire",
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
  
        const nouveauaffect = await Affectation_heure_supp.create({
            PROJET_ID: PROJET_ID,
            COLLABORATEUR_ID:COLLABORATEUR_ID,
            TACHE:TACHE,
            DATE_DEBUT:DATE_DEBUT,
            DATE_FIN:DATE_FIN,
            NBRE_JR_AFFECTATION:differenceEnJours
        });
  
        res.status(200).json({
            message: "Nouvelle catégorie créée avec succès",
            data: nouveauaffect
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Erreur interne du serveur");
    }
  };

  module.exports = {
    creerAffectation
    }