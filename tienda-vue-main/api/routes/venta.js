const express = require('express');
const ventasController = require('../controllers/ventasController');
var authenticate =  require('../middlewares/authenticate')

var router = express.Router();


router.get('/obtener_ventas_admin/:inicio/:hasta', authenticate.decodeToken, ventasController.obtener_ventas_admin);
router.get('/obtener_detalles_venta_admin/:id', authenticate.decodeToken, ventasController.obtener_detalles_venta_admin);

module.exports = router;