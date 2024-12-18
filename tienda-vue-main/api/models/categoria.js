const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    titulo: { type: String, required: true, minlength: 3, maxlength: 50 }, // Validación de longitud
    estado: { type: Boolean, default: true, required: true }, // Estado de la categoría
    createdAt: { type: Date, default: Date.now }, // Fecha de creación
});

// Exportar el modelo
module.exports = model('categoria', CategoriaSchema);
