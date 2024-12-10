const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    titulo: { type: String, required: true, minlength: 3, maxlength: 50 }, // Validación de longitud
    descripcion: { type: String, required: false }, // Descripción opcional
    estado: { type: Boolean, default: true, required: true }, // Estado de la categoría
    createdAt: { type: Date, default: Date.now }, // Fecha de creación
});

// Exportar el modelo
module.exports = model('categoria', CategoriaSchema);
