var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var port = process.env.port || 4201;
const { createServer } = require("http");
const { Server } = require("socket.io");

var app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: '*'}
});

io.on("connection", (socket) => {
  // ...
  socket.on('emit_method',function(data){
    io.emit('semit_method',data);
    console.log(data);
  });
});


var cliente_router = require('./routes/cliente');
var customer_router = require('./routes/customer');
var producto_router = require('./routes/producto');
var public_router = require('./routes/public');
var usuario_router = require('./routes/usuario');
var venta_router = require('./routes/venta');

app.use(bodyparser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyparser.json({limit: '50mb', extended: true}));

mongoose.connect('mongodb://127.0.0.1:27017/tienda')
    .then(() => {
        // Si la conexión es exitosa, obtenemos el puerto del entorno o utilizamos el puerto 4201
        var port = process.env.PORT || 4201;
        // Iniciamos el servidor en el puerto especificado
        app.listen(port, function () {
            console.log('Servidor corriendo en el puerto ' + port);
        });
    })
    .catch((err) => {
        // Si hay un error al conectar a la base de datos, lo mostramos en la consola
        console.error('Error al conectar a la base de datos:', err);
    });
 
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); 
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();
});

app.use('/api',cliente_router);
app.use('/api',usuario_router);
app.use('/api',producto_router);
app.use('/api',public_router);
app.use('/api',customer_router);
app.use('/api',venta_router);

module.exports = app;
