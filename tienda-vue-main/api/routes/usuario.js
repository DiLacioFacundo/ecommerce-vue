const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const authenticate = require('../middlewares/authenticate');
var multipart = require('connect-multiparty');


var path = multipart({ uploadDir: './uploads/usuarios' });
var router = express.Router();

router.post("/crear_usuario_admin", [authenticate.decodeToken, path], usuarioController.crear_usuario_admin);
router.post('/login_usuario', usuarioController.login_usuario);
router.get('/listar_usuarios_admin/:filtro?', authenticate.decodeToken, usuarioController.listar_usuarios_admin);
router.get('/obtener_usuario_admin/:id', authenticate.decodeToken, usuarioController.obtener_usuario_admin);
router.put('/actualizar_usuario_admin/:id', [authenticate.decodeToken, path], usuarioController.actualizar_usuario_admin);
router.post('/cambiar_password_usuario', authenticate.decodeToken, usuarioController.cambiar_password_usuario);
router.post('/renovar_token', authenticate.decodeToken, usuarioController.renovar_token);
router.delete('/eliminar_usuario_admin/:id', authenticate.decodeToken, usuarioController.eliminar_usuario_admin);
router.delete('/eliminar_imagen_usuario', authenticate.decodeToken, usuarioController.eliminar_imagen_usuario);

module.exports = router;
