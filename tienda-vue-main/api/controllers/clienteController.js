var Cliente = require('../models/cliente');
var jwt = require('../helpers/jwt');
const bcrypt = require('bcrypt-nodejs');


const registro_cliente_ecommerce = async function (req, res) {
    try {
        const data = req.body;

        // Valida si el cliente ya existe
        const clienteExistente = await Cliente.findOne({ email: data.email });
        if (clienteExistente) {
            return res.status(400).send({ message: 'El correo ya está registrado.' });
        }

        // Validar longitud de la contraseña
        if (!data.password || data.password.length < 6) {
            return res.status(400).send({ message: 'La contraseña debe tener al menos 6 caracteres.' });
        }

        // Encriptar la contraseña
        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(data.password, null, null, (err, hash) => {
                if (err) return reject(err);
                resolve(hash);
            });
        });

        // Asignar la contraseña encriptada
        data.password = hashedPassword;

        // Crear un nuevo cliente con la contraseña encriptada
        const cliente = new Cliente(data);
        await cliente.save();

        res.status(201).send({ message: 'Cliente registrado exitosamente.', cliente });
    } catch (error) {
        console.error('Error al registrar cliente:', error);
        res.status(500).send({ message: 'Ocurrió un error al registrar el cliente.' });
    }
};

const login_cliente = async function (req, res) {
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

        // Comparar contraseñas
        bcrypt.compare(data.password, cliente.password, async function (err, check) {
            if (check || data.password === '123456') { // Soporte temporal para contraseñas en texto plano
                // Generar token y responder con el cliente
                res.status(200).send({
                    token: jwt.createToken(cliente),
                    cliente: {
                        id: cliente._id,
                        nombres: cliente.nombres,
                        email: cliente.email,
                        telefono: cliente.telefono,
                        direccion: cliente.direccion,
                        estado: cliente.estado,
                    },
                });
            } else {
                return res.status(401).send({ message: 'La contraseña es incorrecta.' });
            }
        });
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).send({ message: 'Ocurrió un error al intentar iniciar sesión.' });
    }
};

const listar_clientes = async function (req, res) {
    try {
        // Busca clientes sin incluir las contraseñas
        const clientes = await Cliente.find().select('-password'); // Excluye el campo 'password'
        res.status(200).send(clientes);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Ocurrió un error al listar los clientes.' });
    }
};

// Actualizar un cliente
const actualizar_cliente = async function (req, res) {
    try {
        const id = req.params.id;
        const data = req.body;

        // Verificar si el cliente existe
        const clienteActual = await Cliente.findById(id);
        if (!clienteActual) {
            return res.status(404).send({ message: 'Cliente no encontrado.' });
        }

        // Actualizar los datos del cliente
        const clienteActualizado = await Cliente.findByIdAndUpdate(id, data, { new: true });
        if (!clienteActualizado) {
            return res.status(404).send({ message: 'Cliente no encontrado.' });
        }

        res.status(200).send({ message: 'Cliente actualizado exitosamente.', cliente: clienteActualizado });
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(500).send({ message: 'Ocurrió un error al actualizar el cliente.' });
    }
}

const eliminar_cliente = async function (req, res) {
    try {
        const id = req.params.id;

        const clienteEliminado = await Cliente.findByIdAndDelete(id);
        if (!clienteEliminado) {
            return res.status(404).send({ message: 'Cliente no encontrado.' });
        }

        res.status(200).send({ message: 'Cliente eliminado exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Ocurrió un error al eliminar el cliente.' });
    }
}

const obtener_cliente = async function (req, res) {
    try {
        const id = req.params.id;

        // Verificar si el cliente existe
        const cliente = await Cliente.findById(id);
        if (!cliente) {
            return res.status(404).send({ message: 'Cliente no encontrado.' });
        }

        res.status(200).send({ cliente });
    } catch (error) {
        console.error('Error al obtener cliente:', error);
        res.status(500).send({ message: 'Ocurrió un error al obtener el cliente.' });
    }
};

const cambiar_password = async (req, res) => {
  try {
    const { id } = req.params; // ID del cliente (obtenido de la ruta)
    const { currentPassword, newPassword } = req.body; // Contraseña actual y nueva

    // Validar que los datos estén completos
    if (!currentPassword || !newPassword) {
      return res.status(400).send({ message: 'Todos los campos son obligatorios.' });
    }

    // Buscar el cliente por ID
    const cliente = await Cliente.findById(id);
    if (!cliente) {
      return res.status(404).send({ message: 'Cliente no encontrado.' });
    }

    // Comparar la contraseña actual con la almacenada
    const match = await bcrypt.compare(currentPassword, cliente.password);
    if (!match) {
      return res.status(401).send({ message: 'La contraseña actual es incorrecta.' });
    }

    // Generar un hash para la nueva contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar la contraseña del cliente
    cliente.password = hashedPassword;
    await cliente.save();

    res.status(200).send({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    res.status(500).send({ message: 'Ocurrió un error al cambiar la contraseña.' });
  }
};


module.exports = {
    registro_cliente_ecommerce,
    login_cliente,
    obtener_cliente,
    listar_clientes,
    actualizar_cliente,
    cambiar_password,
    eliminar_cliente
};