const { Schema, model } = require('mongoose');
const CategoriaSchema = Schema({
    titulo: { type: String, required: true },
    estado: { type: Boolean,default:true, required: true },
    createAt: { type: Date, default: Date.now },
});

module.exports = model('categoria', CategoriaSchema);