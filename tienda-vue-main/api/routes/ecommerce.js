var express = require('express');
var ecommerceController = require('../controllers/ecommerceController');
var router = express.Router();

// Rutas públicas para productos
router.get('/productos/nuevos', ecommerceController.obtener_nuevos_productos); // Últimos 4 productos
router.get('/productos/recomendados', ecommerceController.obtener_productos_recomendados); // 8 productos recomendados
router.get('/productos', ecommerceController.obtener_productos_shop); // Todos los productos disponibles en la tienda
router.get('/productos/:slug', ecommerceController.obtener_producto_por_slug); // Producto por slug
router.get('/productos/categoria/:categoriaId', ecommerceController.obtener_productos_por_categoria);
router.get('/orders/:userId', ecommerceController.getUserOrders);

// Rutas públicas para categorías y subcategorías
router.get('/categorias', ecommerceController.listar_categorias_public); // Categorías con subcategorías y conteo de productos
router.get('/categorias/:categoriaId/subcategorias', ecommerceController.listar_subcategorias_por_categoria_public); // Subcategorías de una categoría específica

module.exports = router;
