// Importaciones
var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require('cors');
const { decodeToken } = require('./middlewares/authenticate');
const path = require("path");

// Importar las rutas del backend
var cliente_router = require('./routes/cliente');
var usuario_router = require('./routes/usuario');
var producto_router = require('./routes/producto');
var customer_router = require('./routes/customer');
var venta_router = require('./routes/venta');
var ecommerce_router = require('./routes/ecommerce');
var categoria_router = require('./routes/categoria');

// Configuración de la aplicación
var app = express();
var port = process.env.PORT || 4201;

// Configuración del servidor HTTP y WebSocket
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: '*' },
});

// Configuración de WebSocket
io.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);
    socket.on('emit_method', (data) => {
        io.emit('semit_method', data);
        console.log(`Mensaje recibido: ${data}`);
    });
    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});

// Configuración de body-parser
app.use(bodyparser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyparser.json({ limit: '50mb', extended: true }));

// Configuración de CORS
app.use(cors({
    origin: '*', // Permitir todas las fuentes (puedes restringirlo según sea necesario)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: [
        'Authorization',
        'X-API-KEY',
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept'
    ],
}));

// Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/tienda')
    .then(() => {
        console.log('Conexión a la base de datos establecida');
    })
    .catch((err) => {
        console.error('Error al conectar a la base de datos:', err);
    });

app.use("/assets", express.static(path.join(__dirname, "assets")));

// Servir archivos estáticos
app.use('/uploads/productos', express.static('uploads/productos'));
app.use('/uploads/usuarios', express.static('uploads/usuarios'));
app.use('/uploads/facturas', express.static('uploads/facturas'));
app.use('/uploads/galeria', express.static('uploads/galeria'));
app.use('/assets', express.static('public/assets'));



// Rutas protegidas (requieren autenticación)
app.use('/api', cliente_router);
app.use('/api', usuario_router);
app.use('/api', producto_router);
app.use('/api', customer_router);
app.use('/api', venta_router);
app.use('/api', categoria_router);
app.use('/api', ecommerce_router);

// Levantar el servidor
httpServer.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`El puerto ${port} ya está en uso. Intenta usar otro puerto.`);
    } else {
        console.error('Error al iniciar el servidor:', err);
    }
});

module.exports = app;
