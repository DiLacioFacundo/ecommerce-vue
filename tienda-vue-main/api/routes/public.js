const express = require('express');
const PublicController = require('../controllers/publicController');
var router = express.Router();

// Rutas públicas para productos
router.get('/nuevos_productos', PublicController.obtener_nuevos_productos); // Últimos 4 productos
router.get('/productos_recomendados', PublicController.obtener_productos_recomendados); // 8 productos recomendados
router.get('/productos_shop', PublicController.obtener_productos_shop); // Todos los productos disponibles en la tienda

// Rutas públicas para categorías y subcategorías
router.get('/categorias', PublicController.listar_categorias_public); // Categorías con subcategorías y conteo de productos
router.get('/subcategorias/:categoriaId',PublicController.listar_subcategorias_por_categoria_public
); 

module.exports = router;
