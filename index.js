const express = require('express');
const cors = require('cors');
const utilisateurs_routes = require('./routes/utilisateurs.routes');
const upload_routes = require('./routes/upload.routes');
const app = express();
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const auth_routes = require('./routes/auth/auth.routes');
const odk_routes = require('./routes/odk.routes');
const bindUser = require('./middlewares/bindUser');
// 1. importation du fichier contenant les routes uploads

// app.use(fileUpload());
dotenv.config()
const port = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
var corsOptions = {
    origin: function (origin, callback) {
              if (!origin || (origin  !== -1)) {
                        callback(null, true)
              } else {
                        callback(new Error('Not allowed by CORS'))
              }
    }
}
app.use(cors(corsOptions));

// Middleware spécifique à une route
app.use("*", bindUser)
app.use('/', utilisateurs_routes)
app.use('/auth', auth_routes)
app.use('/', odk_routes)
// 2. enregistrement du nouveau middleware pour les routes upload
app.use('/upload', upload_routes)
app.listen(port, () => {
 console.log(`TEAM-AGILE-ANTS ${port}`);
});
