const mongoose = require('mongoose');
const bycrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
	local: {
		email: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		}
	},
	facebook: {
		email: String,
		password: String,
		id: String,
		token: String
	},
	twitter: {
		email: String,
		password: String,
		id: String,
		token: String
	},
	google: {
		email: String,
		password: String,
		id: String,
		token: String
	}
});

userSchema.methods.generateHash = function (password) {
	// El algoritmo encriptara la contraseña 8 veces.
	return bycrypt.hashSync(password, bycrypt.genSaltSync(8), null);
};

// Esta funcion compara la contraseña que introduce el usuario cifrada en la
// funcion anterior, con la que esta guardada en la base de datos.
userSchema.methods.validatePassword = function (password) {
	return bycrypt.compareSync(password, this.local.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;