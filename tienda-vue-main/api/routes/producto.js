const express = require('express');
const productoController = require('../controllers/productoController');
const authenticate = require('../middlewares/authenticate');
var multipart = require('connect-multiparty');



var path = multipart({ uploadDir: './uploads/productos' });
var path_ingreso = multipart({ uploadDir: './uploads/facturas' });
var path_galeria = multipart({ uploadDir: './uploads/galeria' });

var router = express.Router();

router.post('/registro_producto_admin', [authenticate.decodeToken, path], productoController.registro_producto_admin);
router.get('/listar_productos_admin/:filtro?', authenticate.decodeToken, productoController.listar_productos_admin);
router.get('/listar_activos_productos_admin', authenticate.decodeToken, productoController.listar_activos_productos_admin);

router.get('/obtener_portada_producto/:img', productoController.obtener_portada_producto);
router.get('/obtener_portada_admin/:id',authenticate.decodeToken, productoController.obtener_producto_admin);
router.put('/actualizar_producto_admin/:id',[authenticate.decodeToken, path], productoController.actualizar_producto_admin);

router.post('/registro_variedad_producto', authenticate.decodeToken, productoController.registro_variedad_producto);
router.get('/obtener_variedades_producto/:id', authenticate.decodeToken, productoController.obtener_variedades_producto);
router.delete('/eliminar_variedad_producto/:id',authenticate.decodeToken, productoController.eliminar_variedad_producto);


router.post('/registro_ingreso_admin', [authenticate.decodeToken,path_ingreso], productoController.registro_ingreso_admin);

router.post('/subir_imagen_producto_admin', [authenticate.decodeToken, path_galeria], productoController.subir_imagen_producto_admin);
router.get('/obtener_galeria_producto/:img', productoController.obtener_galeria_producto);
router.get('/obtener_galeria_producto_admin/:id', authenticate.decodeToken, productoController.obtener_galeria_producto_admin);
router.delete('/eliminar_galeria_producto_admin/:id', authenticate.decodeToken, productoController.eliminar_galeria_producto_admin);

module.exports = router