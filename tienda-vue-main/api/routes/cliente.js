const express = require('express');
const clienteController = require('../controllers/clienteController');

var router = express.Router();

router.post('/registro_cliente_ecommerce', clienteController.registro_cliente_ecommerce);
router.post('/login_cliente', clienteController.login_cliente);


module.exports = router;