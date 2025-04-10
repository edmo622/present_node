const express = require("express");
const utilisateurs_routes = express.Router("");
const utilisateurs_controller = require("../controllers/utilisateurs.controller");
const affectation_controller = require("../controllers/affectation.controller");
const collaborateur_controller = require("../controllers/collaborateur.controller");
const projet_controller = require("../controllers/projet.controller");



const requireAuth = require("../middlewares/requireAuth");

utilisateurs_routes.post("/Categorie", utilisateurs_controller.creercategories)
utilisateurs_routes.get("/Categorieliste", utilisateurs_controller.categorielist)
utilisateurs_routes.post("/createoutils", utilisateurs_controller.createoutils_mediabox)
utilisateurs_routes.get("/get_Categorie", utilisateurs_controller.findAllCategories)
utilisateurs_routes.get("/get_Service", utilisateurs_controller.findAllServices)
utilisateurs_routes.get("/getOutilSequilize", utilisateurs_controller.getOutilSequilize)
utilisateurs_routes.post("/outilsattribution", utilisateurs_controller.createOutilsAttribution)
utilisateurs_routes.get("/get_Stock", utilisateurs_controller.findAllStock)
utilisateurs_routes.get("/get_Outils", utilisateurs_controller.findAllOutils)
utilisateurs_routes.get("/get_Outils_Service", utilisateurs_controller.getOutils_Service)
utilisateurs_routes.post("/cart_New", utilisateurs_controller.addToCart)
utilisateurs_routes.get("/get_listemodl/:ID_SERVICE", utilisateurs_controller.getlistemodl)
utilisateurs_routes.get("/Liste_heure_sup", utilisateurs_controller.Liste_heure_sup)
utilisateurs_routes.post("/Affectation",affectation_controller.creerAffectation)
utilisateurs_routes.get("/getCollab",collaborateur_controller.getCollaborateur)
utilisateurs_routes.post("/loginvr",utilisateurs_controller.login)
utilisateurs_routes.get("/getProjet",projet_controller.getProjet)
utilisateurs_routes.post("/UpdateUtil", utilisateurs_controller.updateUtil)





























































module.exports = utilisateurs_routes
