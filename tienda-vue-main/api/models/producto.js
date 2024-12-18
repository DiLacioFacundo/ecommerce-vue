const { Schema, model } = require('mongoose');

// Definición del esquema
const ProductoSchema = new Schema({
    titulo: { type: String, required: true, unique: true }, // Título del producto
    slug: { type: String, required: true, unique: true }, // Slug único para SEO
    categoria: { type: Schema.ObjectId, ref: "categoria", required: true }, // Referencia a Categoria
    subcategoria: { type: Schema.ObjectId, ref: 'subcategoria', required: true }, // Referencia a SubCategoria
    precio: { type: Number, required: true, min: 0 }, // Precio base del producto
    extracto: { type: String, required: true }, // Extracto breve del producto
    imagenes: [{ type: String, required: true }], // Array de imágenes
    stock: { type: Number, default: 0, required: true, min: 0 }, // Stock total del producto
    str_variedad: { type: String, required: true }, // Nombre de la variedad
    variantes: [
        {
            nombre: { type: String, required: true }, // Nombre de la variante (e.g., color, sabor)
            precio: { type: Number, required: true, min: 0 }, // Precio específico para la variante
            stock: { type: Number, required: true, min: 0 }, // Stock específico para la variante
        },
    ],
    estado: { type: Boolean, default: true, required: true }, // Estado (activo o inactivo)
    descuento: { type: Number, default: 0, min: 0, max: 100 }, // Porcentaje de descuento (0-100%)
    precio_descuento: {
        type: Number,
        default: function () {
            return this.descuento > 0
                ? this.precio - (this.precio * this.descuento) / 100
                : this.precio;
        },
    }, // Precio con descuento calculado automáticamente
    etiquetas: [{ type: String, maxlength: 30 }], // Etiquetas como "Nuevo", "Oferta", con longitud máxima
    calificaciones: [
        {
            usuario: { type: Schema.ObjectId, ref: 'usuario', required: true }, // Usuario que calificó
            comentario: { type: String, maxlength: 500 }, // Comentario de la reseña
            puntuacion: { type: Number, min: 1, max: 5, required: true }, // Puntuación (1-5 estrellas)
        },
    ],
    createdAt: { type: Date, default: Date.now }, // Fecha de creación
    updatedAt: { type: Date, default: Date.now }, // Fecha de última actualización
});

// Middleware para calcular el precio con descuento
ProductoSchema.pre('save', function (next) {
    if (this.descuento > 0) {
        this.precio_descuento = this.precio - (this.precio * this.descuento) / 100;
    } else {
        this.precio_descuento = this.precio;
    }
    this.updatedAt = Date.now(); // Actualizar automáticamente la fecha de modificación
    next();
});

// Middleware para actualizar `updatedAt` en métodos `findOneAndUpdate` y similares
ProductoSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});

// Exportar el modelo
module.exports = model('producto', ProductoSchema);
