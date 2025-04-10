const Affectation_heure_supp = require("../models/Affectation_heure_supp");
const Validations = require("../models/Validations");
const Collaborateurs = require("../models/Collaborateurs");
const Equipes = require("../models/Equipes");
const Projets = require('../models/Projets');
const Validation = require("../class/Validation")

// dotenv.config()

const getCollaborateur = async (req, res) => {      
    try {           
        const collab = await Collaborateurs.findAll()          
        res.status(200).json(collab)      
    } catch (error) {           
        res.status(500).send("Erreur interne du serveur")      
    } 
} 
  module.exports = {
    getCollaborateur
    }