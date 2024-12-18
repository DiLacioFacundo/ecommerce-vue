var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    rol: { type: String, required: true },
    password: { type: String, required: true },
    estado: { type: Boolean, default: true, required: true },
    telefono: { type: String, required: true },
    direccion: { type: String, required: true }, 
    fecha_nacimiento: { type: Date, required: true }, 
    genero: { type: String, enum: ['masculino', 'femenino', 'otro'], required: false },
    imagen: { type: String, required: true },
    ultimo_acceso: { type: Date, default: null }, 
    token_verificacion: { type: String, required: false }, 
    fecha_desactivacion: { type: Date, default: null }, 
    createdAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('usuario', UsuarioSchema);
