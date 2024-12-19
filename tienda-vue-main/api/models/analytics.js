const { Schema, model } = require('mongoose');

const AnalyticsSchema = Schema({
    visitante: {
        type: String,
        required: false, // Puedes almacenar datos como IP o identificador de visitante
    },
    fecha: {
        type: Date,
        default: Date.now, // Registrar la fecha de cada visita
    },
    fuente: {
        type: String,
        enum: ['Directo', 'Google', 'Facebook', 'Otro'], // Opcional: de dónde proviene el visitante
        default: 'Directo',
    },
    evento: {
        type: String,
        enum: ['visita', 'compra'], // Diferentes tipos de eventos (puedes ampliarlo según tu necesidad)
        required: true,
    },
});

module.exports = model('Analytics', AnalyticsSchema);
