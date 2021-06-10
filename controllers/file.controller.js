// Dependencia para el uso de rutas.
const path = require('path');
// fs nos permitira listar y obtener todos los archivos guardados en una carpeta.
const fs = require("fs");
// Modulo para gestionar la subida de archivos al servidor
const formidable = require('formidable');

const baseUrl = "https://myskycloudjacobo.herokuapp.com/files/";

const uploadFilesController = function (app) {
	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) { return next(); }
		return res.redirect('/');
	};
	app.post("/upload", isLoggedIn, (req, res, next) => {
		try {
			uploadFiles(req, res, next);
		} catch (error) {
			return next(error);
		}
	});
}
function uploadFiles(req, res, next) {
	if (!fs.existsSync(dirGlobal)) {
		fs.mkdirSync(dirGlobal);
	}
	fs.readdir(dirGlobal, function (err, files) {
		if (err) {
			onerror(err);
			return;
		}
		else if (files.length == 0)
			console.log('No existen archivos.');
		else
			console.log(files);
	});
	const form = new formidable.IncomingForm();
	form.maxFileSize = 300 * 1024 * 1024;
	form.uploadDir = logUserName;
	form.parse(req);
	// 'fileBegin' SE INVOCA CUANDO UN ARCHIVO COMIENZA A SUBIRSE.
	form.on('fileBegin', (field, file) => {
		console.log("Subiendo archivo...");
		let ts = Date.now();
		let date_ob = new Date(ts);
		let date = date_ob.getDate();
		let month = date_ob.getMonth() + 1;
		let year = date_ob.getFullYear();
		let finalDate = date + "-" + month + "-" + year + "_" + ts + "-";
		filename = finalDate + file.name;
		console.log("Nombre del archivo: ", filename);
		file.path = dirGlobal + "/" + filename;
	});
	// 'file' SE INVOCA CUANDO EL ARCHIVO SE HA GUARDADO POR COMPLETO
	form.on('file', (field, file) => {
		console.log("Archivos guardado!");
	})
	form.on('end', function () {
		res.status(200).redirect('/save')
	});
}

global.arrayImages = [];
global.arrayFiles = [];
global.arrayVideos = [];
global.arrayMusic = [];
function getListFiles() {

	filenames = fs.readdirSync(dirGlobal);

	console.log("\nArchivos en el directorio: ", dirGlobal);
	var idImg = 0;
	var idVideo = 0;
	var idMusic = 0;
	var idFile = 0;
	filenames.forEach(file => {
		if (path.extname(file) == ".jpg" || path.extname(file) == ".png" || path.extname(file) == ".gif" || path.extname(file) == ".jpeg") {
			arrayImages.push({
				id: idImg,
				name: file,
				url: baseUrl + file,
			});
			idImg++;
		} else if (path.extname(file) == ".mp4" || path.extname(file) == ".avi" || path.extname(file) == ".mkv") {
			arrayVideos.push({
				id: idVideo,
				name: file,
				url: baseUrl + file,
			});
			idVideo++;
		} else if (path.extname(file) == ".mp3" || path.extname(file) == ".mid" || path.extname(file) == ".midi" || path.extname(file) == ".wav" || path.extname(file) == ".wma") {
			arrayMusic.push({
				id: idMusic,
				name: file,
				url: baseUrl + file,
			});
			idMusic++;
		} else {
			arrayFiles.push({
				id: idFile,
				name: file,
				url: baseUrl + file,
			});
			idFile++;
		}
	});
	console.log("Imagenes: ", arrayImages);
	console.log("Videos: ", arrayVideos);
	console.log("Musica: ", arrayMusic);
	console.log("Ficheros: ", arrayFiles);
}


const download = (req, res) => {
	const fileName = req.params.name;

	res.download(dirGlobal + "/" + fileName, fileName, (err) => {
		if (err) {
			res.status(500).send({
				message: "Error al descargar el archivo. " + err,
			});
		}
	});
};

module.exports = {
	getListFiles,
	download,
	uploadFilesController,
};
