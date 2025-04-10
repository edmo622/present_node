const jwt = require('jsonwebtoken');

// Vérification renforcée
if (!process.env.JWT_SECRET) {
  throw new Error("Configuration JWT manquante !");
}

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };