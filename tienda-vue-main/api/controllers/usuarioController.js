var Usuario = require('../models/usuario');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');
const path = require("path");
const fs = require("fs");



const crear_usuario_admin = async function (req, res) {
    if (!req.user) {
        return res.status(401).send({
            data: undefined,
            message: "No autorizado: Token inválido o ausente",
        });
    }
    const data = req.body;

    try {
        // Verificar si el correo ya está registrado
        const usuarioExistente = await Usuario.findOne({ email: data.email });
        if (usuarioExistente) {
            return res.status(400).send({
                data: undefined,
                message: "El correo electrónico ya existe.",
            });
        }

        // Manejar la imagen
        let imagenRuta = "/uploads/usuarios/default.png"; // Ruta predeterminada
        if (req.files && req.files.imagen) {
            const imagen = req.files.imagen;

            // Validar tamaño y tipo de archivo
            const allowedExtensions = [".png", ".jpg", ".jpeg"];
            const ext = path.extname(imagen.originalFilename).toLowerCase();
            if (!allowedExtensions.includes(ext)) {
                return res.status(400).send({
                    message: "Formato de imagen no válido. Use JPEG o PNG.",
                });
            }
            if (imagen.size > 1 * 1024 * 1024) {
                return res.status(400).send({
                    message: "La imagen debe pesar menos de 1MB.",
                });
            }

            // Generar un nombre único para la imagen
            const uniqueFilename = `${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 8)}${ext}`;

            // Ruta para guardar el archivo
            const uploadDir = path.join(__dirname, "../uploads/usuarios");
            const uploadPath = path.join(uploadDir, uniqueFilename);

            // Crear el directorio si no existe
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Guardar la imagen
            const buffer = fs.readFileSync(imagen.path);
            fs.writeFileSync(uploadPath, buffer);

            // Actualizar la ruta de la imagen
            imagenRuta = `/uploads/usuarios/${uniqueFilename}`;
        }

        // Encriptar la contraseña
        bcrypt.hash(data.password, null, null, async (err, hashedPassword) => {
            if (err) {
                return res.status(500).send({
                    data: undefined,
                    message: "Error al encriptar la contraseña.",
                });
            }

            // Reemplazar la contraseña con la encriptada
            data.password = hashedPassword;

            // Agregar la ruta de la imagen al usuario
            data.imagen = imagenRuta;

            // Crear el usuario
            const usuario = await Usuario.create(data);

            res.status(201).send({
                data: usuario,
                message: "Usuario creado exitosamente.",
            });
        });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).send({
            data: undefined,
            message: "Error interno al registrar usuario admin",
        });
    }
}

const login_usuario = async function (req, res) {
    const data = req.body;

    try {
        const usuarios = await Usuario.find({ email: data.email });

        if (usuarios.length >= 1) {
            const usuario = usuarios[0];
            if (usuario.estado) {
                // Comparar contraseña encriptada o permitir temporalmente "123456"
                bcrypt.compare(data.password, usuario.password, async function (err, check) {
                    if (check || data.password === "123456") { // Temporalmente permitir "123456"
                        // Actualizar el último acceso
                        usuario.ultimo_acceso = new Date();
                        await usuario.save();

                        res.status(200).send({
                            token: jwt.createToken(usuario),
                            usuario: {
                                id: usuario._id,
                                nombre: usuario.nombre,
                                apellido: usuario.apellido,
                                email: usuario.email,
                                rol: usuario.rol,
                                imagen: usuario.imagen,
                                estado: usuario.estado,
                                telefono: usuario.telefono,
                                direccion: usuario.direccion,
                                fecha_nacimiento: usuario.fecha_nacimiento,
                                genero: usuario.genero,
                                ultimo_acceso: usuario.ultimo_acceso,
                            },
                        });
                    } else {
                        res.status(400).send({ message: "La contraseña es incorrecta." });
                    }
                });
            } else {
                res.status(403).send({ message: "Su cuenta está desactivada." });
            }
        } else {
            res.status(404).send({ message: "No se encontró el correo electrónico." });
        }
    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        res.status(500).send({ message: "Error interno del servidor." });
    }
};


const listar_usuarios_admin = async function (req, res) {
    if (req.user) {
        let filtro = req.params['filtro'] || ''; // Si no hay filtro, lo establecemos como una cadena vacía.

        try {
            let usuarios;
            if (filtro.trim() === '') {
                // Si no hay filtro, devolvemos todos los usuarios
                usuarios = await Usuario.find();
            } else {
                // Si hay un filtro, aplicamos el mismo
                usuarios = await Usuario.find({
                    $or: [
                        { nombres: new RegExp(filtro, 'i') },
                        { apellidos: new RegExp(filtro, 'i') },
                        { email: new RegExp(filtro, 'i') },
                    ]
                });
            }

            res.status(200).send(usuarios);
        } catch (error) {
            console.error('Error al listar usuarios:', error);
            res.status(500).send({ data: undefined, message: 'Error al obtener usuarios' });
        }
    } else {
        res.status(500).send({ data: undefined, message: 'ErrorToken' });
    }
};

const obtener_usuario_admin = async function (req, res) {
    if (req.user) {
        try {
            let id = req.params['id'];

            if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).send({ message: 'ID de usuario inválido' });
            }

            const usuario = await Usuario.findById(id).select(
                'nombre apellido email rol imagen estado telefono genero fecha_nacimiento'
            );

            // Verificar si el usuario existe
            if (!usuario) {
                return res.status(404).send({ message: 'Usuario no encontrado' });
            }

            res.status(200).send(usuario);
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            res.status(500).send({ message: 'Error al obtener usuario' });
        }
    } else {
        res.status(401).send({ message: 'No autorizado: Token inválido o ausente' });
    }
};

const actualizar_usuario_admin = async function (req, res) {
    if (req.user) {
        let id = req.params['id'];
        let data = req.body;

        try {
            const usuarioActual = await Usuario.findById(id);
            if (!usuarioActual) {
                return res.status(404).send({ message: 'El usuario no existe.' });
            }

            if (usuarioActual.rol === 'empleado' && data.rol && data.rol !== 'empleado') {
                return res.status(403).send({ message: 'No se permite cambiar el rol de empleado a administrador.' });
            }

            if (data.email) {
                const usuarioExistente = await Usuario.findOne({ email: data.email });
                if (usuarioExistente && usuarioExistente._id.toString() !== id) {
                    return res.status(400).send({ message: 'El correo electrónico ya está en uso.' });
                }
            }

            let camposActualizados = {};

            Object.keys(data).forEach((key) => {
                if (key !== "password" && key !== "imagen") {
                    camposActualizados[key] = data[key];
                }
            });

            if (req.files && req.files.imagen) {
                const imagen = req.files.imagen;

                const allowedExtensions = ['.png', '.jpg', '.jpeg'];
                const ext = path.extname(imagen.originalFilename).toLowerCase();
                if (!allowedExtensions.includes(ext)) {
                    return res.status(400).send({ message: 'Formato de imagen no válido. Use JPEG o PNG.' });
                }
                if (imagen.size > 1 * 1024 * 1024) {
                    return res.status(400).send({ message: 'La imagen debe pesar menos de 1MB.' });
                }

                const uniqueFilename = `${Date.now()}-${Math.random()
                    .toString(36)
                    .substring(2, 8)}${ext}`;
                const uploadDir = path.join(__dirname, '../uploads/usuarios');
                const uploadPath = path.join(uploadDir, uniqueFilename);

                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                if (usuarioActual.imagen && usuarioActual.imagen !== `/uploads/usuarios/${uniqueFilename}`) {
                    const oldImagePath = path.join(__dirname, `../${usuarioActual.imagen}`);
                    fs.unlink(oldImagePath, (err) => {
                        if (err) console.error('Error al eliminar la imagen antigua:', err);
                    });
                }

                const buffer = fs.readFileSync(imagen.path);
                fs.writeFileSync(uploadPath, buffer);

                camposActualizados.imagen = `/uploads/usuarios/${uniqueFilename}`;
            }

            if (data.password) {
                if (data.password.length < 6) {
                    return res.status(400).send({ message: 'La contraseña debe tener al menos 6 caracteres.' });
                }

                // Verificar si la nueva contraseña es igual a la actual
                const isSamePassword = await new Promise((resolve, reject) => {
                    bcrypt.compare(data.password, usuarioActual.password, (err, isMatch) => {
                        if (err) reject(err);
                        resolve(isMatch);
                    });
                });

                if (isSamePassword) {
                    return res.status(400).send({ message: 'La nueva contraseña no puede ser igual a la actual.' });
                }

                // Encriptar la contraseña antes de actualizar
                const hashedPassword = await new Promise((resolve, reject) => {
                    bcrypt.hash(data.password, null, null, (err, hash) => {
                        if (err) return reject(err);
                        resolve(hash);
                    });
                });

                camposActualizados.password = hashedPassword;
            }

            // Actualizar el usuario
            const usuario = await Usuario.findByIdAndUpdate(id, camposActualizados, { new: true });
            res.status(200).send(usuario);
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            res.status(500).send({ message: 'Error al actualizar usuario' });
        }
    } else {
        res.status(500).send({ message: 'ErrorToken' });
    }
};


const cambiar_password_usuario = async (req, res) => {
    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
        return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    try {
        // Buscar usuario por ID
        const usuario = await Usuario.findById(userId);

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        // Comparar la nueva contraseña con la contraseña actual
        const isSamePassword = await new Promise((resolve, reject) => {
            bcrypt.compare(newPassword, usuario.password, (err, isMatch) => {
                if (err) reject(err);
                resolve(isMatch);
            });
        });

        if (isSamePassword) {
            return res.status(400).json({
                message: "La nueva contraseña no puede ser igual a la actual.",
            });
        }

        // Encriptar la nueva contraseña
        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(newPassword, null, null, (err, hash) => {
                if (err) reject(err);
                resolve(hash);
            });
        });

        // Actualizar la contraseña del usuario
        usuario.password = hashedPassword;
        await usuario.save();

        res.status(200).json({ message: "Contraseña actualizada correctamente." });
    } catch (error) {
        console.error("Error al cambiar la contraseña:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
}

const renovar_token = async function (req, res) {
    // Usuario obtenido del middleware decodeToken
    const user = req.user;

    if (user) {
        // Crear un nuevo token con los datos del usuario
        const newToken = jwt.createToken(user);
        res.status(200).send({ token: newToken });
    } else {
        res.status(401).send({ message: 'Usuario no autenticado' });
    }
}

const eliminar_usuario_admin = async function (req, res) {
    if (req.user) {
        let id = req.params['id'];

        try {
            let usuario = await Usuario.findByIdAndDelete(id);
            if (!usuario) {
                return res.status(404).send({ message: 'Usuario no encontrado' });
            }
            res.status(200).send({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            res.status(500).send({ message: 'Error al eliminar usuario' });
        }
    } else {
        res.status(500).send({ data: undefined, message: 'ErrorToken' });
    }
};

const eliminar_imagen_usuario = (req, res) => {
    const { path: imagePath } = req.body;

    // Validar que se proporcione una ruta
    if (!imagePath) {
        return res.status(400).json({ message: "No se proporcionó una ruta de imagen." });
    }

    // Construir la ruta completa de la imagen en el servidor
    const fullPath = path.join(__dirname, "..", imagePath);

    // Verificar si el archivo existe
    fs.access(fullPath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error("Error: La imagen no existe:", fullPath);
            return res.status(404).json({ message: "La imagen no existe." });
        }

        // Eliminar el archivo
        fs.unlink(fullPath, (err) => {
            if (err) {
                console.error("Error al eliminar el archivo:", err);
                return res.status(500).json({ message: "Error al eliminar la imagen." });
            }

            res.json({ message: "Imagen eliminada correctamente." });
        });
    });
};

module.exports = {
    crear_usuario_admin,
    eliminar_imagen_usuario,
    login_usuario,
    listar_usuarios_admin,
    obtener_usuario_admin,
    actualizar_usuario_admin,
    cambiar_password_usuario,
    eliminar_usuario_admin,
    renovar_token
}