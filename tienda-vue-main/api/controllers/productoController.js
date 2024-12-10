var Producto = require('../models/producto');
var Galeria = require('../models/galeria');
var Variedad = require('../models/variedad');
var Ingreso = require('../models/ingreso');
var Ingreso_detalle = require('../models/ingreso_detalle');
var slugify = require('slugify');
var fs = require('fs');
var path = require('path');

const registrar_producto_admin = async function (req, res) {
    if (req.user) {
        const data = req.body;

        try {
            // Validar campos obligatorios
            if (!data.categoria || !mongoose.Types.ObjectId.isValid(data.categoria)) {
                return res.status(400).send({ data: undefined, message: 'La categoría no es válida.' });
            }
            if (!data.titulo) {
                return res.status(400).send({ data: undefined, message: 'El título es obligatorio.' });
            }
            if (!data.precio || data.precio <= 0) {
                return res.status(400).send({ data: undefined, message: 'El precio debe ser mayor a 0.' });
            }
            if (!data.stock || data.stock < 0) {
                return res.status(400).send({ data: undefined, message: 'El stock no puede ser negativo.' });
            }

            // Verificar si el título ya existe
            const productos = await Producto.find({ titulo: data.titulo });
            if (productos.length >= 1) {
                return res
                    .status(400)
                    .send({ data: undefined, message: 'El título del producto ya existe.' });
            }

            // Validar imagen de portada
            if (!req.file) {
                return res
                    .status(400)
                    .send({ data: undefined, message: 'Debe proporcionar una imagen de portada.' });
            }

            // Procesar portada
            const img_path = req.file.path;
            const str_img = img_path.split('/');
            const str_portada = str_img[str_img.length - 1];
            data.portada = str_portada;

            // Generar slug
            data.slug = slugify(data.titulo, { lower: true });

            // Crear producto
            const producto = await Producto.create(data);
            res.status(201).send({ data: producto, message: 'Producto creado exitosamente.' });
        } catch (error) {
            // Manejo de errores
            if (error.name === 'ValidationError') {
                return res.status(400).send({ data: undefined, message: 'Datos inválidos.' });
            }
            console.error(error);
            res.status(500).send({ data: undefined, message: 'No se pudo crear el producto.' });
        }
    } else {
        res.status(403).send({ data: undefined, message: 'ErrorToken' });
    }
};

const listar_productos_admin = async function (req, res) {
    if (req.user) {
        try {
            const filtro = req.params['filtro'] || '';

            // Buscar productos con filtro por título
            const productos = await Producto.find({
                titulo: new RegExp(filtro, 'i'), // Filtro solo en el campo "titulo"
            })
                .populate({
                    path: 'categoria',
                    select: 'titulo', // Solo traer el campo "titulo" de la categoría
                })
                .populate({
                    path: 'subcategoria',
                    select: 'titulo', // Solo traer el campo "titulo" de la subcategoría
                })
                .sort({ createdAt: -1 });

            res.status(200).send(productos);
        } catch (error) {
            console.error('Error al listar productos:', error);
            res.status(500).send({ data: undefined, message: 'Error al listar productos.' });
        }
    } else {
        res.status(403).send({ data: undefined, message: 'ErrorToken' });
    }
};


const obtener_portada_producto = async function (req, res) {
    let img = req.params['img'];

    fs.stat('./uploads/productos/' + img, function (err) {
        if (err) {
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        } else {
            let path_img = './uploads/productos/' + img;
            res.status(200).sendFile(path.resolve(path_img));
        }
    });
}


const obtener_producto_admin = async function (req, res) {
    if (req.user) {

        let id = req.params['id'];

        try {
            let producto = await Producto.findById({ _id: id });

            res.status(200).send(producto);
        } catch (error) {
            res.status(200).send(undefined);
        }

    } else {
        res.status(500).send({ data: undefined, message: 'ErrorToken' });
    }
}

const actualizar_producto_admin = async function (req, res) {
    if (req.user) {
        let data = req.body;
        let id = req.params['id'];

        try {
            const productos = await Producto.find({ titulo: data.titulo });
            if (productos.length >= 1 && productos[0]._id != id) {
                return res
                    .status(400)
                    .send({ data: undefined, message: 'El título del producto ya existe.' });
            }

            if (req.files) {
                let img_path = req.files.portada.path;
                let str_img = img_path.split('\\');
                let str_portada = str_img[2];

                data.portada = str_portada;
            }

            data.slug = slugify(data.titulo);

            const producto = await Producto.findByIdAndUpdate(
                { _id: id },
                {
                    titulo: data.titulo,
                    categoria: data.categoria,
                    subcategoria: data.subcategoria,
                    extracto: data.extracto,
                    estado: data.estado,
                    str_variedad: data.str_variedad,
                    descuento: data.descuento,
                    portada: data.portada,
                    etiquetas: data.etiquetas,
                    variantes: data.variantes,
                },
                { new: true }
            );

            res.status(200).send({ data: producto });
        } catch (error) {
            console.log(error);
            res.status(500).send({ data: undefined, message: 'No se pudo actualizar el producto.' });
        }
    } else {
        res.status(403).send({ data: undefined, message: 'ErrorToken' });
    }
};


const registro_variedad_producto = async (req, res) => {
    if (req.user) {

        let data = req.body;

        let variedad = await Variedad.create(data);
        res.status(200).send({ data: variedad });

    } else {
        res.status(500).send({ data: undefined, message: 'ErrorToken' });
    }
}


const obtener_variedad_producto = async function (req, res) {
    if (req.user) {

        let id = req.params['id'];
        let variedades = await Variedad.find({ producto: id }).sort({ stock: -1 });
        res.status(200).send(variedades);

    } else {
        res.status(500).send({ data: undefined, message: 'ErrorToken' });
    }
}

const eliminar_variedad_producto = async function (req, res) {
    if (req.user) {

        let id = req.params['id'];

        let reg = await Variedad.findById({ _id: id });

        if (reg.stock == 0) {
            let variedad = await Variedad.findOneAndRemove({ _id: id });
            res.status(200).send(variedad);
        } else {
            res.status(200).send({ data: undefined, message: 'No se puede eliminar esta variedad' });
        }



    } else {
        res.status(500).send({ data: undefined, message: 'ErrorToken' });
    }
}

const listar_activos_productos_admin = async function (req, res) {
    if (req.user) {

        let productos = await Producto.find({ estado: true }).sort({ createdAt: -1 });
        res.status(200).send(productos);

    } else {
        res.status(500).send({ data: undefined, message: 'ErrorToken' });
    }
}

const registro_ingreso_admin = async function (req, res) {
    if (req.user) {
        const data = req.body;

        try {
            const reg_ingresos = await Ingreso.find().sort({ createdAt: -1 });
            data.serie = reg_ingresos.length ? reg_ingresos[0].serie + 1 : 1;

            const detalles = JSON.parse(data.detalles); // detalles de ingreso
            const img_path = req.files.documento.path;
            const str_img = img_path.split('\\');
            const str_documento = str_img[2];

            data.documento = str_documento;
            data.usuario = req.user.sub;

            const ingreso = await Ingreso.create(data);

            for (const item of detalles) {
                item.ingreso = ingreso._id;
                await Ingreso_detalle.create(item);

                // Actualizar stock de la variante
                const variedad = await Variedad.findById(item.variedad);
                await Variedad.findByIdAndUpdate(item.variedad, {
                    stock: variedad.stock + item.cantidad,
                });

                // Actualizar stock general del producto
                const producto = await Producto.findById(item.producto);
                await Producto.findByIdAndUpdate(item.producto, {
                    stock: producto.stock + item.cantidad,
                });

                // Ajustar precio
                const ganancia = Math.ceil((item.precio_unidad * data.ganancia) / 100);
                const nuevo_precio = parseFloat(item.precio_unidad) + ganancia;
                await Producto.findByIdAndUpdate(item.producto, { precio: nuevo_precio });
            }

            res.status(200).send(ingreso);
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: 'No se pudo registrar el ingreso' });
        }
    } else {
        res.status(403).send({ data: undefined, message: 'ErrorToken' });
    }
};


const subir_imagen_producto_admin = async function (req, res) {
    if (req.user) {
        let data = req.body;

        //REGISTRO PRODUCTO
        var img_path = req.files.imagen.path;
        var str_img = img_path.split('\\');
        var str_imagen = str_img[2];

        ///

        data.imagen = str_imagen;
        try {
            let imagen = await Galeria.create(data);
            res.status(200).send(imagen);
        } catch (error) {
            console.log(error);
            res.status(200).send({ data: undefined, message: 'No se pudo crear el producto.' });
        }
    } else {
        res.status(500).send({ data: undefined, message: 'ErrorToken' });
    }
}

const obtener_galeria_producto = async function (req, res) {
    let img = req.params['img'];

    fs.stat('./uploads/galeria/' + img, function (err) {
        if (err) {
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        } else {
            let path_img = './uploads/galeria/' + img;
            res.status(200).sendFile(path.resolve(path_img));
        }
    });
}

const obtener_galeria_producto_admin = async function (req, res) {
    if (req.user) {
        let id = req.params['id'];

        let galeria = await Galeria.find({ producto: id });
        res.status(200).send(galeria);

    } else {
        res.status(500).send({ data: undefined, message: 'ErrorToken' });
    }
}


const eliminar_galeria_producto_admin = async function (req, res) {
    if (req.user) {
        let id = req.params['id'];

        try {
            let reg = await Galeria.findById({ _id: id });
            let path_img = './uploads/galeria/' + reg.imagen;
            fs.unlinkSync(path_img);


            let galeria = await Galeria.findByIdAndDelete({ _id: id });
            res.status(200).send(galeria);
        } catch (error) {
            console.log(error);
            res.status(200).send({ data: undefined, message: 'No se pudo eliminar la imagen.' });
        }


    } else {
        res.status(500).send({ data: undefined, message: 'ErrorToken' });
    }
}

module.exports = {
    registrar_producto_admin,
    listar_productos_admin,
    obtener_portada_producto,
    obtener_producto_admin,
    actualizar_producto_admin,
    registro_variedad_producto,
    obtener_variedad_producto,
    eliminar_variedad_producto,
    listar_activos_productos_admin,
    registro_ingreso_admin,
    subir_imagen_producto_admin,
    obtener_galeria_producto,
    obtener_galeria_producto_admin,
    eliminar_galeria_producto_admin
}