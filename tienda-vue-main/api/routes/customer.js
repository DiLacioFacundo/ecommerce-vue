const express = require('express');
const customerController = require('../controllers/customerController');
const authenticate = require('../middlewares/authenticate');

var router = express.Router();

// Rutas para el carrito
router.post('/crear_producto_carrito', authenticate.decodeToken, customerController.crear_producto_carrito);
router.get('/obtener_carrito_cliente', authenticate.decodeToken, customerController.obtener_carrito_cliente);
router.delete('/eliminar_producto_carrito/:id', authenticate.decodeToken, customerController.eliminar_producto_carrito);

// Rutas para direcciones
router.post('/crear_direccion_cliente', authenticate.decodeToken, customerController.crear_direccion_cliente);
router.get('/obtener_direcciones_cliente', authenticate.decodeToken, customerController.obtener_direcciones_cliente);
router.delete('/eliminar_direccion_cliente/:id', authenticate.decodeToken, customerController.eliminar_direccion_cliente);

// Rutas para ventas
router.post('/crear_venta_cliente', authenticate.decodeToken, customerController.crear_venta_cliente);
router.get('/obtener_informacion_venta/:id', authenticate.decodeToken, customerController.obtener_informacion_venta);
router.get('/validar_payment_id_venta/:payment_id', authenticate.decodeToken, customerController.validar_payment_id_venta);

module.exports = router;
