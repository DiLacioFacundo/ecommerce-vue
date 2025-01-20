const express = require('express');
const clienteController = require('../controllers/clienteController');

var router = express.Router();

router.get('/clientes', clienteController.obtener_cliente); 
router.post('/registro_cliente_ecommerce', clienteController.registro_cliente_ecommerce);
router.post('/login_cliente', clienteController.login_cliente);
router.get('/listar_clientes', clienteController.listar_clientes);
router.put('/actualizar_cliente/:id', clienteController.actualizar_cliente);
router.delete('/eliminar_cliente/:id', clienteController.eliminar_cliente);
router.put('/cambiar_password/:id', clienteController.cambiar_password);
router.get('/compras/:id', clienteController.obtener_compras_cliente);

module.exports = router;
