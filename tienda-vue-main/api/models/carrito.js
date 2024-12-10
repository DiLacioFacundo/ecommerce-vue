const { Schema, model } = require('mongoose');
const CarritoSchema = Schema({
    producto: { type: Schema.ObjectId,ref:'producto',required: true },
    variedad: { type: Schema.ObjectId,ref:'variedad',required: true },
    cantidad: { type: Number, required: true },
    cliente: { type: Schema.ObjectId,ref:'cliente',required: true },
    createAt: { type: Date, default: Date.now },
});

module.exports = model('carrito', CarritoSchema);