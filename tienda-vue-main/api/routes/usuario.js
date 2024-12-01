const express = require('express');
const usuarioControllers = require('../controllers/usuarioController');
const authenticate = require('../middlewares/authenticate');

var router = express.Router();


router.post('/registro_usuario_admin', authenticate.decodeToken, usuarioControllers.registro_usuario_admin);
router.post('/login_usuario', usuarioControllers.login_usuario);
router.get('/listar_usuario_admin/:filtro?', authenticate.decodeToken, usuarioControllers.listar_usuario_admin);
router.get('/obtener_usuario_admin/:id', authenticate.decodeToken, usuarioControllers.obtener_usuario_admin);
router.put('/actualizar_usuario_admin/:id', authenticate.decodeToken, usuarioControllers.actualizar_usuario_admin);
router.put('/cambiar_estado_usuario_admin/:id', authenticate.decodeToken, usuarioControllers.cambiar_estado_usuario_admin); 

module.exports = router;
