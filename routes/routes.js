const path = require('path');
const controllerRoute = path.join(__dirname, "..", "controllers", "file.controller");
const controller = require(controllerRoute);

module.exports = (app, passport) => {

	app.get("/", (req, res) => {

		res.render('index');
	});

	app.get("/404", (req, res) => {
		res.render("404");
	});

	app.get('/login', (req, res) => {
		res.render('login', {
			message: req.flash('loginMessage')
		});
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));

	app.get('/signup', (req, res) => {
		res.render('signup', {
			message: req.flash('signupMessage')
		});
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	app.get('/profile', isLoggedIn, (req, res) => {
		res.render('profile', {
			user: logUserName
		});
	});

	app.get("/info", (req, res) => {
		res.render('info');
	});

	app.get("/files", isLoggedIn, (req, res) => {
		controller.getListFiles();

		res.render('files', {
			images: arrayImages,
			videos: arrayVideos,
			music: arrayMusic,
			ficheros: arrayFiles,
		});
	});

	app.get("/files/:name", isLoggedIn, controller.download);

	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});

	app.get("/upload", isLoggedIn, (req, res) => {
		res.render('upload');
	});

	app.get("/save", isLoggedIn, (req, res) => {
		res.render('save');
	});

};

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	return res.redirect('/');
};
