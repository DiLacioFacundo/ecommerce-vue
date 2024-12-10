var Cliente = require('../models/cliente');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/cjwt');

const registro_cliente_ecommerce = async function(req, res) {
    try {
        let data = req.body;

        // Verifica si el correo electrónico ya existe
        let reg = await Cliente.find({ email: data.email });

        if (reg.length >= 1) {
            res.status(200).send({ message: 'El correo electrónico ya existe' });
        } else {
            // Guarda los datos directamente sin encriptar la contraseña
            let cliente = await Cliente.create(data);
            res.status(200).send(cliente);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error durante el registro' });
    }
};


const login_cliente = async function(req, res) {
    try {
        var data = req.body;

        // Busca el cliente por correo electrónico
        var clientes = await Cliente.find({ email: data.email });

        if (clientes.length >= 1) {
            // Verifica si el cliente está activo
            if (clientes[0].estado) {
                // Compara directamente las contraseñas
                if (data.password === clientes[0].password) {
                    res.status(200).send({
                        token: jwt.createToken(clientes[0]),
                        cliente: clientes[0]
                    });
                } else {
                    res.status(200).send({ data: undefined, message: 'La contraseña es incorrecta.' });
                }
            } else {
                res.status(200).send({ data: undefined, message: 'Su cuenta está desactivada.' });
            }
        } else {
            res.status(200).send({ data: undefined, message: 'No se encontró el correo electrónico.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error durante el inicio de sesión' });
    }
};


module.exports = {
    registro_cliente_ecommerce,
    login_cliente
}