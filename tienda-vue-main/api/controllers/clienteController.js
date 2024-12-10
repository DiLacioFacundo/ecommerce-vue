var Cliente = require('../models/cliente');
var jwt = require('../helpers/jwt');

const registro_cliente_ecommerce = async function(req, res) {
    try {
        const data = req.body;

        // Valida si el cliente ya existe
        const clienteExistente = await Cliente.findOne({ email: data.email });
        if (clienteExistente) {
            return res.status(400).send({ message: 'El correo ya está registrado.' });
        }

        // Crear un nuevo cliente (contraseña sin encriptar)
        const cliente = new Cliente(data);
        await cliente.save();

        res.status(201).send({ message: 'Cliente registrado exitosamente.', cliente });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Ocurrió un error al registrar el cliente.' });
    }
};

const login_cliente = async function(req, res) {
    const data = req.body;

    try {
        // Buscar cliente por correo electrónico
        const cliente = await Cliente.findOne({ email: data.email });

        if (!cliente) {
            return res.status(404).send({ message: 'No se encontró el correo electrónico.' });
        }

        // Verificar estado del cliente
        if (!cliente.estado) {
            return res.status(403).send({ message: 'Su cuenta está desactivada.' });
        }

        // Comparar contraseñas directamente
        if (data.password === cliente.password) {
            // Generar token y responder con el cliente
            res.status(200).send({
                token: jwt.createToken(cliente),
                cliente: cliente,
            });
        } else {
            return res.status(401).send({ message: 'La contraseña es incorrecta.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Ocurrió un error al intentar iniciar sesión.' });
    }
};

module.exports = {
    registro_cliente_ecommerce,
    login_cliente
};
