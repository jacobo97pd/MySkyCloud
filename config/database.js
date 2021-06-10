const mongoose = require('mongoose');

// const { MYSKY_MONGODB_HOST, MYSKY_MONGODB_DATABASE } = process.env;

// const mongoUri = `mongodb://${MYSKY_MONGODB_HOST}/${MYSKY_MONGODB_DATABASE}`
// mongodb+srv://<username>:<password>@mysky.ragmu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
mongoose.connect(process.env.DB_URL_ATLAS, {
	// mongoose.connect(mongoUri, {
	// Para eliminar el mensaje de la consola
	// useMongoClient: true,
	useNewUrlParser: true,
	useUnifiedTopology: true
})
	.then(db => console.log('Se ha establecido conexion con la base de datos.'))
	.catch(err => console.log(err));
/*
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error al conectar a la BBDD:')); // enlaza el track de error a la consola (proceso actual)
db.once('open', () => {
	console.log('Se ha establecido conexion con la BBDD'); // si esta todo ok, imprime esto
});
*/