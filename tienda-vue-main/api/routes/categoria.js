const express = require('express');
const categoriaController = require('../controllers/categoriaController');
const authenticate = require('../middlewares/authenticate');
var router = express.Router();

// Categorías
router.post(
    '/registrar_categoria_admin',
    authenticate.decodeToken,
    categoriaController.registrar_categoria_admin
);
router.get(
    '/listar_categorias_admin',
    authenticate.decodeToken,
    categoriaController.listar_categorias_admin
);
router.put(
    '/actualizar_categoria_admin/:id',
    authenticate.decodeToken,
    categoriaController.actualizar_categoria_admin
);
router.delete(
    '/eliminar_categoria_admin/:id',
    authenticate.decodeToken,
    categoriaController.eliminar_categoria_admin
);

// Subcategorías
router.post(
    '/registrar_subcategoria_admin',
    authenticate.decodeToken,
    categoriaController.registrar_subcategoria_admin
);
router.get(
    '/listar_subcategorias_por_categoria_admin/:categoriaId',
    authenticate.decodeToken,
    categoriaController.listar_subcategorias_por_categoria_admin
);
router.delete(
    '/eliminar_subcategoria_admin/:id',
    authenticate.decodeToken,
    categoriaController.eliminar_subcategoria_admin
);

router.get('/obtener_categoria_admin/:id', authenticate.decodeToken,
    categoriaController.obtener_categoria_admin);

router.put('/actualizar_subcategoria_admin/:id', authenticate.decodeToken,
    categoriaController.actualizar_subcategoria_admin);

module.exports = router;
