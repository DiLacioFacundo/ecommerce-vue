const { Schema, model } = require('mongoose');

const SubcategoriaSchema = Schema({
    titulo: { type: String, required: true }, // Nombre de la subcategoría
    categoria: { type: Schema.ObjectId, ref: 'categoria', required: true }, // Referencia a la categoría principal
    descripcion: { type: String, required: false }, // Descripción opcional
    estado: { type: Boolean, default: true, required: true }, // Estado de la subcategoría
    createdAt: { type: Date, default: Date.now }, // Fecha de creación
});

// Exportar el modelo
module.exports = model('subcategoria', SubcategoriaSchema);
