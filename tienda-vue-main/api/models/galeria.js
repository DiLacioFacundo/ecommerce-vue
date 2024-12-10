const { Schema, model } = require('mongoose');

const GaleriaSchema = Schema({
    imagen: { type: String, required: true }, // Ruta de la imagen
    producto: { type: Schema.ObjectId, ref: 'producto', required: true }, // Referencia al producto
    createdAt: { type: Date, default: Date.now }, // Fecha de creación
});

module.exports = model('galeria', GaleriaSchema);
