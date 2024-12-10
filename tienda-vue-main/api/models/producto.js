var { Schema, model } = require('mongoose');


// Definición del esquema
const ProductoSchema = new Schema({
    titulo: { type: String, required: true }, // Título del producto
    slug: { type: String, required: true, unique: true }, // Slug único para SEO
    categoria: { type: Schema.ObjectId, ref: "categoria", required: true }, // Referencia a Categoria
    subcategoria: { type: Schema.ObjectId, ref: 'subcategoria', required: false }, // Referencia a SubCategoria
    precio: { type: Number, required: true }, // Precio del producto
    extracto: { type: String, required: true }, // Extracto breve del producto
    portada: { type: String, required: true }, // Imagen principal del producto
    stock: { type: Number, default: 0, required: true }, // Stock total del producto
    str_variedad: { type: String, required: true }, // Nombre de la variedad
    variantes: [
        {
            nombre: { type: String }, // Nombre de la variante (e.g., color, sabor)
            precio: { type: Number }, // Precio específico para la variante
            stock: { type: Number }, // Stock específico para la variante
        },
    ],
    estado: { type: Boolean, default: true, required: true }, // Estado (activo o inactivo)
    descuento: { type: Boolean, default: false, required: true }, // Si el producto está en descuento
    porcentaje_descuento: { type: Number, default: 0 }, // Porcentaje de descuento (solo si está en descuento)
    precio_descuento: {
        type: Number,
        default: function () {
            return this.descuento
                ? this.precio - (this.precio * this.porcentaje_descuento) / 100
                : this.precio;
        },
    }, // Precio con descuento calculado automáticamente
    etiquetas: [{ type: String }], // Etiquetas como "Nuevo", "Oferta"
    calificaciones: [
        {
            usuario: { type: Schema.ObjectId, ref: 'usuario' }, // Usuario que calificó
            comentario: { type: String }, // Comentario de la reseña
            puntuacion: { type: Number, min: 1, max: 5 }, // Puntuación (1-5 estrellas)
        },
    ],
    createdAt: { type: Date, default: Date.now }, // Fecha de creación
    updatedAt: { type: Date }, // Fecha de última actualización
});

// Middleware para calcular el precio con descuento
ProductoSchema.pre('save', function (next) {
    if (this.descuento && this.porcentaje_descuento > 0) {
        this.precio_descuento = this.precio - (this.precio * this.porcentaje_descuento) / 100;
    } else {
        this.precio_descuento = this.precio;
    }
    next();
});

// Exportar el modelo
module.exports = model('producto', ProductoSchema);
