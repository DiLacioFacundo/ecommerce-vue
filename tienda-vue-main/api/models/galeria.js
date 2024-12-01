const { Schema, model } = require('mongoose');
const GaleriaSchema = Schema({
    imagen: { type: String, required: true },
    producto: { type: Schema.ObjectId, ref: 'producto',required: true },
    createAt: { type: Date, default: Date.now },
});

module.exports = model('galeria', GaleriaSchema);