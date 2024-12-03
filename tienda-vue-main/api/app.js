// Importaciones
var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
const { createServer } = require("http");
const { Server } = require("socket.io");

// Configuración de la aplicación
var app = express();
var port = process.env.PORT || 4201; // Define el puerto

// Configuración del servidor HTTP y WebSocket
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: '*' }, // Permitir conexiones desde cualquier origen
});

// Configuración de WebSocket
io.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    socket.on('emit_method', function (data) {
        io.emit('semit_method', data);
        console.log(`Mensaje recibido: ${data}`);
    });

    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});

// Rutas del backend
var cliente_router = require('./routes/cliente');
var customer_router = require('./routes/customer');
var producto_router = require('./routes/producto');
var public_router = require('./routes/public');
var usuario_router = require('./routes/usuario');
var venta_router = require('./routes/venta');

// Configuración de body-parser
app.use(bodyparser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyparser.json({ limit: '50mb', extended: true }));

// Configuración de CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow', 'GET, PUT, POST, DELETE, OPTIONS');
    next();
});

// Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/tienda')
    .then(() => {
        console.log('Conexión a la base de datos establecida');
        // Levantar el servidor HTTP y WebSocket
        httpServer.listen(port, () => {
            console.log(`Servidor corriendo en el puerto ${port}`);
        });
    })
    .catch((err) => {
        console.error('Error al conectar a la base de datos:', err);
    });

// Registro de rutas
app.use('/api', cliente_router);
app.use('/api', usuario_router);
app.use('/api', producto_router);
app.use('/api', public_router);
app.use('/api', customer_router);
app.use('/api', venta_router);

// Exportación de la aplicación
module.exports = app;
