/**
 * REQUERIMIENTOS DE MODULOS DE NODEJS
 */

// Para manejar variables de entorno
const dotenv = require('dotenv').config();

// Importamos express
const express = require('express');
// const expressFileUpload = require('express-fileupload')
const app = express();

// Dependencia para el uso de rutas.
const path = require('path');

// Modulo para gestionar la autentificacion de usuarios en el sistema.
const passport = require('passport');

// Modulo para gestion de errores por parte del usuario
const flash = require('connect-flash');

// Modulo para mostrar por consola los metodos http que llegan al servidor
const morgan = require('morgan');

// Modulo para poder administrar cookies
const cookieParser = require('cookie-parser');

// Gestion de cookies
const session = require('express-session');

/**
 * CONFIGURACION DE SERVIDOR
 */

// Variable PORT coge por defecto el puerto de la variable de entorno.
// En caso contrario coge el puerto 3000.
app.set('port', process.env.PORT || 3000);
app.set('host', process.env.HOST || '0.0.0.0');
app.set('views', path.join(__dirname, "..", 'views'));

// Motor de plantillas.
app.set('view engine', 'ejs');

// Ficheros estaticos
app.use(express.static(path.join(__dirname, "..", "public")));

// Los datos que se mandan entre el servidor y el cliente se mandan en formato JSON
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));

/**
 * CONEXION CON LA BASE DE DATOS
 */

require(path.join(__dirname, "..", "config", "database.js"));

// Configuracion de passport
const passportRute = path.join(__dirname, "..", "config", "passport.js");
require(passportRute)(passport);

/**
 * MIDDLEWARES
 */

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
	secret: 'key',
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
// Para pasar mensajes entre paginas html
app.use(flash());

// Rutas para comunicar la app con el html y css
const routesRoute = path.join(__dirname, "..", "routes", "routes.js");
require(routesRoute)(app, passport);

const controllerRoute = path.join(__dirname, "..", "controllers", "file.controller");
const controller = require(controllerRoute);

// SUBIDA DE ARCHIVOS AL SERVIDOR
controller.uploadFilesController(app);

app.use(function (req, res, next) {
	res.status(404).render('404', { title: "Sorry, page not found" });
});

app.listen(app.get('port'), app.get('host'), () => {
	console.log('Server is up on port:', app.get('port'), 'on host:', app.get('host'));
});