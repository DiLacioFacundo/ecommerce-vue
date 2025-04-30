var express = require('express');
var router = express.Router();
var { procesar_pago_brick } = require('../controllers/pagoController');

router.post('/pagos/brick', procesar_pago_brick);

module.exports = router;
