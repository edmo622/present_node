const Affectation_heure_supp = require("../models/Affectation_heure_supp");
const Validations = require("../models/Validations");
const Collaborateurs = require("../models/Collaborateurs");
const Equipes = require("../models/Equipes");
const Projets = require('../models/Projets');
const Validation = require("../class/Validation")

// dotenv.config()

const getProjet = async (req, res) => {      
    try {           
        const projet = await Projets.findAll()          
        res.status(200).json(projet)      
    } catch (error) {           
        res.status(500).send("Erreur interne du serveur")      
    } 
} 
  module.exports = {
    getProjet
    }