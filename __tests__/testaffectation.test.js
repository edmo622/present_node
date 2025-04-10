// Import the function to be tested
const { creerAffectation } = require('../controllers/affectation.controller');

// Mock dependencies if needed
jest.mock('../models/Affectation_heure_supp', () => ({
  create: jest.fn(),
}));
jest.mock('../class/Validation', () => jest.fn().mockImplementation(() => ({
  run: jest.fn(),
  isValidate: jest.fn(),
  getErrors: jest.fn(),
})));

describe('creerAffectation function', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        PROJET_ID: '123',
        COLLABORATEUR_ID: '456',
        TACHE: 'Some task',
        DATE_DEBUT: '2024-11-21',
        DATE_FIN: '2024-11-22',
        NBRE_JR_AFFECTATION: 2,
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  // it('should create a new affectation successfully', async () => {
  //   // Mock Validation instance methods
  //   const Validation = require('../class/Validation');
  //   const validationInstance = new Validation();
  //   validationInstance.run.mockResolvedValue();
  //   validationInstance.isValidate.mockResolvedValue(true);

  //   // Mock Affectation_heure_supp.create method
  //   const Affectation_heure_supp = require('../models/Affectation_heure_supp');
  //   Affectation_heure_supp.create.mockResolvedValue({ /* mock affectation data */ });

  //   await creerAffectation(req, res);

  //   expect(res.status).toHaveBeenCalledWith(422);
  //   expect(res.json).toHaveBeenCalledWith({
  //     message: 'Nouvelle catégorie créée avec succès',
  //     data: expect.any(Object), // Check for any object in the response data
  //   });
  // });

  it('should handle validation errors', async () => {
    // Mock Validation instance methods to simulate validation failure
    const Validation = require('../class/Validation');
    const validationInstance = new Validation();
    validationInstance.run.mockResolvedValue();
    validationInstance.isValidate.mockResolvedValue(false);
    validationInstance.getErrors.mockResolvedValue({ /* mock validation errors */ });

    await creerAffectation(req,res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      message: 'La validation des données a échoué',
      data: undefined,
    });
  });

  // it('should handle internal server errors', async () => {
  //   // Mock an error being thrown within the function
  //   const error = new Error('Internal server error');
  //   jest.mock('../models/Affectation_heure_supp', () => ({
  //     create: jest.fn(),
  //   }));
  
  //   await creerAffectation(req, res);

  //   expect(console.log).toHaveBeenCalledWith(error);
  //   expect(res.status).toHaveBeenCalledWith(500);
  //   expect(res.send).toHaveBeenCalledWith('Erreur interne du serveur');
  // });
});