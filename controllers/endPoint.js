
const json_ident = require("../models/Json_identite")
const infoperso = require("../models/InformationPersonnel")
const dotenv = require("dotenv");
const { EmptyResultError } = require("sequelize");
dotenv.config()

const UtilisateurUpload = require("../class/uploads/UtilisateurUpload")
const IMAGES_DESTINATIONS = require("../constants/IMAGES_DESTINATIONS")
const path = require("path")

const fetch = require('node-fetch');
const fs = require('fs');
const { Console } = require("console");

const save = async (data, callback) => {
    try {
        const dataJSONString = JSON.stringify(data);

        if (typeof dataJSONString !== 'string') {
            throw new Error('DATA_JSON doit être une chaîne de caractères JSON valide');
        }
        

        const datas = await json_ident.create({
            DATA_JSON: dataJSONString
        });

        // Vérifier si le message est présent et est une chaîne de caractères avant d'utiliser 'includes'
        let message = "Enregistré avec succès";
        if (message && typeof message === 'string' && message.includes("Enregistré")) {
            callback(null, {
                message: message,
                data: {
                    datas
                }
            });
        } else {
            throw new Error('Le message est invalide');
        }
    } catch (error) {
        console.error(error);
        callback(error, null);
    }
};

 const traiter = async (req, res) => {
    try {
        const DataJson = await json_ident.findAll({ where: { STATUT: 1 }, limit: 2 });

        const results = DataJson.map(row => {
            const jsonData = JSON.parse(row.dataValues['DATA_JSON']);
           
            const identite = jsonData.results[0];

            return {
                json_id: row.dataValues['JSON_ID'],
                nom: identite['identite/nom'],
                prenom: identite['identite/prenom'],
                sexe: identite['identite/sexe'],
                papa: identite['identite/papa'],
                mere: identite['identite/mere'],
                province: identite['identite/province'],
                commune: identite['identite/commune'],
                zone: identite['identite/zone'],
                colline: identite['identite/colline'],
                dateNaissance: identite['identite/date_naissance'],
                statut: identite['identite/statut'],
                profession: identite['identite/profession'],
                image: identite['identite/image'],
                lieuOctroi: identite['identite/lieu'],
                dateOctroi: identite['identite/date_octroi'],
                admicom: identite['identite/admicom'],
                NUMERO: identite['identite/numero'],
                deviceid: identite['deviceid']
            };
        });

        // console.log("Résultats:", results);


        for (const result of results) {

            const GetDoublon = await infoperso.findOne({ where: { 
                NOM: result.nom,
                PRENOM: result.prenom,
                NOM_PERE: result.papa,
                NOM_MERE: result.mere,
                COLLINE: result.colline
                // NUMERO: result.NUMERO,
             }});
    
            // console.log(GetDoublon)
            let IS_DOUBLON = 0;
            if(GetDoublon){
                IS_DOUBLON = 1;
            }

            // let paths = path;
           
             const imageUrl = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.utilisateurs}${path.sep}${result.image}`
            //  return console.log(imageUrl)
            //  const { IMAGE_ODK } = result.image || {}
            // const utilisateurUpload = new UtilisateurUpload()
            // const fichier = await utilisateurUpload.upload(IMAGE_ODK)
           
            // const imageUrls = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.utilisateurs}${path.sep}${fichier.fileInfo.fileName}`
            // // let path = "class/uploads/";
            const datas = await infoperso.create({
                IS_DOUBLON:IS_DOUBLON,
                NOM: result.nom,
                PRENOM: result.prenom,
                // SEXE: result.sexe,
                SEXE_ID: 1,
                NOM_PERE: result.papa,
                NOM_MERE: result.mere,
                PROVINCE_ID: result.province,
                COMMUNE_ID: result.commune,
                ZONE_ID: result.zone,
                COLLINE: result.colline,
                DATE_NAISSANCE: result.dateNaissance,
                ETAT_CIVIL_ID: result.statut,
                PROFESSION_ID: result.profession,
                // IMAGE: path + result.image,
                IMAGE: imageUrl,
                LIEU_LIVRAISON: result.lieuOctroi,
                DATE_LIVRAISON: result.dateOctroi,
                NOM_DELIVRE_PAR: result.admicom,
                DEVICE_ID: result.deviceid,
                // NUMERO: result.NUMERO,
                NUMERO:1234321,
                JSON_ID: result.json_id,
                IS_DOUBLON: IS_DOUBLON
            });

            console.log("Enregistrement réussi:", datas);
            
            const dataupdated = await json_ident.update({
                STATUT: 1
            }, {
                where: {
                    JSON_ID: result.json_id
                }
            });

            console.log("Mise à jour réussi:", dataupdated);
        } 

        res.status(200).json({
            message: "Enregistrements effectués avec succès"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Erreur interne du serveur");
    }
};



const getPhoto = async (req, res) => {
    try {
        const DataJson = await json_ident.findAll({ where: { TRAITER_IMAGE: 1 }, limit: 2 });

        const results = DataJson.map(row => {
            const jsonData = JSON.parse(row.dataValues['DATA_JSON']);
            const identite = jsonData.results[0];

            return {
                photo: identite['_attachments'],
                json_id: row.dataValues['JSON_ID'],
            };
        });
  
        for (const result of results) {
            const images = result.photo;

            for (const image of images) {
                const imageName = image['filename'].split("/").pop();
                const imageUrl = image['download_medium_url'];

                console.log("url image", imageUrl);
                const response = await fetch(imageUrl);
                const buffer = await response.buffer();
             
                // const imageUrl2 = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.utilisateurs}${path.sep}`

                // const imagePath = 'class/uploads/' + imageName;
                const imagePath = 'public/uploads/images/utilisateurs/' + imageName;

                fs.writeFileSync(imagePath, buffer);

                console.log("Enregistrement réussi:", imageName);
                
                // console.log("id", result.json_id);

                try {
                    const dataupdated = await json_ident.update({ TRAITER_IMAGE: 1 }, { where: { JSON_ID: result.json_id } });
                    console.log("Mise à jour réussie:", dataupdated);
                } catch (updateError) {
                    console.error("Erreur lors de la mise à jour :", updateError);
                }
            }
        }

        res.status(200).json({
            message: "Téléchargements effectués avec succès"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Erreur interne du serveur");
    }
};
module.exports = {
    traiter,
    getPhoto,
    save
};
