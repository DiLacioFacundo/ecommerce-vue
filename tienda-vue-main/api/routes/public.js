const express = require('express');
const publicController = require('../controllers/publicController');

var router = express.Router();


router.get('/obtener_nuevos_productos', publicController.obtener_nuevos_productos);
router.get('/obtener_productos_recomendados', publicController.obtener_productos_recomendados);
router.get('/obtener_productos_shop',  publicController.obtener_productos_shop);
router.get('/listar_categorias_public',  publicController.listar_categorias_public);

module.exports = router;