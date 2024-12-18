const express = require('express');
const authenticate =  require('../middlewares/authenticate')
const ventasController = require('../controllers/ventasController');

var router = express.Router();


router.get("/ventas/admin", authenticate.decodeToken, ventasController.obtener_ventas_admin);
router.get('/ventas/admin/:id', authenticate.decodeToken, ventasController.obtener_detalles_venta_admin);
router.post('/ventas/guardar', authenticate.decodeToken, ventasController.guardar_venta);
router.put("/ventas/estado", authenticate.decodeToken, ventasController.actualizar_estado_venta);

module.exports = router;