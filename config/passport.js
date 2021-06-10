// Dependencia para el uso de rutas.
const path = require('path');
// fs nos permitira listar y obtener todos los archivos guardados en una carpeta.
const fs = require('fs');
// Registro de usuario Local
const LocalStrategy = require('passport-local').Strategy;

const userRoute = path.join(__dirname, "..", "models", "user.js");
const User = require(userRoute);

// VARIABLES GLOBALES PARA RECUPERACION DE DATOS.
global.dirGlobal = "";
global.logUserName = "";

module.exports = function (passport) {

	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	// SIGN UP
	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
		function (req, email, password, done) {
			User.findOne({ 'local.email': email }, function (err, user) {
				if (err) { return done(err); }
				if (user) {
					return done(null, false, req.flash('signupMessage', 'Ya existe una cuenta con este correo.'));
				} else {
					var newUser = new User();
					newUser.local.email = email;

					// Creo la carpeta del usuario.
					userName(email);

					newUser.local.password = newUser.generateHash(password);
					newUser.save(function (err) {
						if (err) { throw err; }
						return done(null, newUser);
					});
				}
			})
		}));

	// LOGIN
	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
		function (req, email, password, done) {
			User.findOne({ 'local.email': email }, function (err, user) {
				if (err) { return done(err); }
				if (!user) {
					return done(null, false, req.flash('loginMessage', 'No existe ninguna cuenta con este correo'));
				} if (!user.validatePassword(password)) {
					return done(null, false, req.flash('loginMessage', 'La contraseña no es correcta'));
				}
				userName(email);
				const userTransform = email.split('@');
				const username = userTransform[0];
				logUserName = username;
				const dir = path.join(__dirname, "..", username);
				dirGlobal = dir;
				console.log("Usuario loggeado: ", username);
				console.log("")
				return done(null, user);
			})
		}));
}

// FUNCION PARA CREAR EL DIRECTORIO CON EL NOMBRE DEL USUARIO EN CASO DE QUE NO EXISTA.
function userName(email) {
	const userTransform = email.split('@');
	const username = userTransform[0];

	console.log("Nuevo usuario registrado: ", username);
	logUserName = username;
	const dir = path.join(__dirname, "..", username);
	console.log("Directorio creado: ", dir);
	dirGlobal = dir;

	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
};