const { Schema, model } = require('mongoose');
const SubcategoriaSchema = Schema({
    titulo: { type: String, required: true },
    estado: { type: Schema.ObjectId,ref:'categoria',required: true },
    createAt: { type: Date, default: Date.now },
});

module.exports = model('subcategoria', SubcategoriaSchema);