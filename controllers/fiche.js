const utilisateursController = require('./utilisateurs.controller.js');

const content = 'Exemple de phrase ajoutée au PDF.';
const pdfFilePath = require("../constants/IMAGES_DESTINATIONS"); // Chemin où le fichier PDF sera sauvegardé

utilisateursController.generateAndSavePDF(content, pdfFilePath);