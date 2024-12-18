const express = require('express');
const productoController = require('../controllers/productoController');
const authenticate = require('../middlewares/authenticate');
var multipart = require('connect-multiparty');



var path = multipart({ uploadDir: './uploads/productos' });
var path_ingreso = multipart({ uploadDir: './uploads/facturas' });

var router = express.Router();

router.post('/registrar_producto_admin', [authenticate.decodeToken,path], productoController.registrar_producto_admin);
router.get('/listar_productos_admin/:filtro?', authenticate.decodeToken, productoController.listar_productos_admin);
router.delete('/eliminar_producto_admin/:id', authenticate.decodeToken, productoController.eliminar_producto_admin);

router.get('/obtener_producto_admin/:id',authenticate.decodeToken, productoController.obtener_producto_admin);
router.put('/actualizar_producto_admin/:id',[authenticate.decodeToken, path], productoController.actualizar_producto_admin);

router.post('/registro_variedad_producto', authenticate.decodeToken, productoController.registro_variedad_producto);
router.get('/obtener_variedad_producto/:id', authenticate.decodeToken, productoController.obtener_variedad_producto);
router.delete('/eliminar_variedad_producto/:id',authenticate.decodeToken, productoController.eliminar_variedad_producto);

module.exports = router