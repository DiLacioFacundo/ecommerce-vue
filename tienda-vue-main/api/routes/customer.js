var express = require('express')
var customerController =  require('../controllers/customerController')
var authenticate =  require('../middlewares/authenticate')

var router = express.Router();

router.post('/crear_producto_carrito',authenticate.decodeToken,customerController.crear_producto_carrito);
router.get('/obtener_carrito_cliente',authenticate.decodeToken,customerController.obtener_carrito_cliente);
router.delete('/eliminar_producto_carrito/:id',authenticate.decodeToken,customerController.eliminar_producto_carrito);
router.post('/crear_direccion_cliente',authenticate.decodeToken,customerController.crear_direccion_cliente);
router.get('/obtener_direcciones_cliente',authenticate.decodeToken,customerController.obtener_direcciones_cliente);
router.delete('/eliminar_direccion_cliente',authenticate.decodeToken,customerController.eliminar_direccion_cliente);
module.exports = router