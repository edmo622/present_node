const express = require("express");
const odk_routes = express.Router("");
const Endpointe = require("../controllers/endPoint");
const Liste = require("../controllers/ListingIdentite");
const { SaveHS, get_tache, get_collaborateur, get_projets, get_equipe, getOne_suicide } = require("../controllers/DeclarationSuicide");


odk_routes.post('/get_instance_data', (req, res) => {
    const flux = req.body;
    
    // Appel de la méthode de contrôleur pour enregistrer les données
    Endpointe.save(flux, (err, message) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (message && message.includes('Erreur')) {
                res.status(500).send(message);
            } else {
                res.status(200).send(message);
            }
        }
    });
});

odk_routes.get('/traiter',Endpointe.traiter);
odk_routes.get('/getPhoto',Endpointe.getPhoto);
odk_routes.get('/listing2',Liste.listing2);
odk_routes.put("/updateOdk/:INFO_ID",Liste.updateOdk);
odk_routes.get("/getOne/:INFO_ID",Liste.getOne);
odk_routes.get('/get_sexe',Liste.getSexe);
odk_routes.get('/get_profession',Liste.getProfession);
odk_routes.get('/get_statut',Liste.getStatut);
odk_routes.get('/get_province',Liste.getProvince);

odk_routes.get('/get_commune/:PROVINCE_ID',Liste.getCommune);
odk_routes.get('/get_zone/:COMMUNE_ID',Liste.getZone);
odk_routes.get('/get_colline/:ZONE_ID',Liste.getColline);
odk_routes.get('/deleteinfo/:INFO_ID',Liste.supprimerInfoCNI);

odk_routes.post('/SaveHS/',SaveHS);
odk_routes.get('/taches/:COLLABORATEUR_ID',get_tache);
odk_routes.get('/collaborateur/',get_collaborateur);
odk_routes.get('/projets/',get_projets);
odk_routes.get('/equipe/',get_equipe);
odk_routes.get("/getOne_suicide/:AFFECTATION_ID",getOne_suicide);

module.exports = odk_routes;
