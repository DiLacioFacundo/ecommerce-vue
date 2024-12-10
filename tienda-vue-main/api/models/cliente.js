var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ClienteSchema = Schema({
    nombres: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    genero: { type: String, required: false },
    pais: { type: String, required: false },
    estado: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('cliente',ClienteSchema);
