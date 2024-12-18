const Producto = require('../models/producto');
const Variedad = require('../models/variedad');
const fs = require('fs');
const path = require('path');
const { Types } = require('mongoose');
const slugify = require('slugify');

const registrar_producto_admin = async function (req, res) {
    if (!req.user) {
        return res.status(403).send({ data: undefined, message: 'ErrorToken' });
    }

    const data = req.body;

    try {
        const slug = slugify(data.titulo, { lower: true });

        // Validar si existe un producto con el mismo slug
        const productoExistente = await Producto.findOne({ slug });
        if (productoExistente) {
            return res.status(400).send({
                data: undefined,
                message: 'Ya existe un producto con el mismo título.',
            });
        }

        // Manejar imágenes
        let imagenes = [];
        if (req.files && req.files.imagenes) {
            const archivosImagenes = Array.isArray(req.files.imagenes)
                ? req.files.imagenes
                : [req.files.imagenes];

            imagenes = archivosImagenes.map((img) => `/uploads/productos/${img.path.split(/[\/\\]/).pop()}`);
        }

        // Validar que al menos una imagen se haya proporcionado
        if (imagenes.length === 0) {
            return res.status(400).send({ message: 'Debe proporcionar al menos una imagen válida.' });
        }

        // Procesar variantes a partir de str_variedad
        let variantes = [];
        const stockGlobal = parseInt(data.stock) || 0;

        if (data.str_variedad) {
            const variedades = data.str_variedad.split(',').map((variedad) => variedad.trim());

            // Distribuir el stock equitativamente entre las variantes
            const stockDistribuido = Math.floor(stockGlobal / variedades.length);

            variantes = variedades.map((nombre, index) => {
                const variante = {
                    nombre,
                    precio: data.precio || 0, // Precio base
                    stock: stockDistribuido,
                };

                // Ajustar el residuo en la última variante
                if (index === variedades.length - 1) {
                    const stockRestante = stockGlobal - stockDistribuido * variedades.length;
                    variante.stock += stockRestante;
                }

                return variante;
            });
        } else {
            // Si no hay variedades, manejar un caso por defecto
            variantes = [{
                nombre: 'Única',
                precio: data.precio || 0,
                stock: stockGlobal, // Todo el stock va a la única variante
            }];
        }

        // Calcular stock total (para verificar consistencia)
        const stockTotal = variantes.reduce((acc, variante) => acc + (parseInt(variante.stock) || 0), 0);

        // Crear el producto con variantes
        const producto = await Producto.create({
            ...data,
            slug,
            imagenes,
            variantes,
            stock: stockTotal,
        });

        res.status(201).send({ data: producto, message: 'Producto creado exitosamente.' });
    } catch (error) {
        console.error('Error al registrar producto:', error);
        res.status(500).send({ data: undefined, message: 'Error interno al registrar el producto.' });
    }
};


const listar_productos_admin = async function (req, res) {
    if (req.user) {
        try {
            const filtro = req.params['filtro'] || '';
            const serverUrl = `${req.protocol}://${req.get('host')}`;

            const productos = await Producto.find({
                titulo: new RegExp(filtro, 'i'),
            })
                .populate({
                    path: 'categoria',
                    select: 'titulo',
                })
                .populate({
                    path: 'subcategoria',
                    select: 'titulo',
                })
                .sort({ createdAt: -1 });

            // Transformar rutas relativas de imágenes en URLs completas
            const productosConUrls = productos.map((producto) => {
                producto.imagenes = producto.imagenes.map((img) => {
                    // Asegurarse de que la ruta es relativa y luego añadir el dominio
                    if (img.startsWith('/uploads')) {
                        return `${serverUrl}${img}`;
                    }
                    return img;  // Si la imagen ya tiene una URL completa no hacer nada
                });
                return producto;
            });

            res.status(200).send(productosConUrls);
        } catch (error) {
            console.error('Error al listar productos:', error);
            res.status(500).send({ data: undefined, message: 'Error al listar productos.' });
        }
    } else {
        res.status(403).send({ data: undefined, message: 'ErrorToken' });
    }
};

const obtener_producto_admin = async function (req, res) {
    if (!req.user) {
        return res.status(401).send({ data: undefined, message: 'Usuario no autenticado.' });
    }

    const id = req.params['id'];
    const serverUrl = `${req.protocol}://${req.get('host')}`;

    try {
        const producto = await Producto.findById(id);

        if (!producto) {
            return res.status(404).send({ data: undefined, message: 'Producto no encontrado.' });
        }

        // Corregir la concatenación de la URL de las imágenes
        producto.imagenes = producto.imagenes.map((img) => {
            if (img.startsWith('/uploads')) {
                return `${serverUrl}${img}`;
            }
            return `${serverUrl}/uploads/productos/${img}`;
        });

        res.status(200).send({ data: producto });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send({ data: undefined, message: 'Error al obtener el producto.' });
    }
};

const actualizar_producto_admin = async function (req, res) {
    if (!req.user) {
        return res.status(403).send({ data: undefined, message: "ErrorToken" });
    }

    const id = req.params["id"];
    let data = req.body;

    try {
        // Validar título único generando el slug
        const slug = slugify(data.titulo, { lower: true });

        const productoExistente = await Producto.findOne({ slug });
        if (productoExistente && productoExistente._id.toString() !== id) {
            return res.status(400).send({
                data: undefined,
                message: "Ya existe otro producto con el mismo título.",
            });
        }

        // Manejar imágenes
        let nuevasImagenes = [];
        if (req.files && req.files.imagenes) {
            const imagenes = Array.isArray(req.files.imagenes)
                ? req.files.imagenes
                : [req.files.imagenes];

            nuevasImagenes = imagenes.map((img) => {
                const imgPath = img.path.split(/[\/\\]/).pop();
                return `/uploads/productos/${imgPath}`;
            });
        }

        // Procesar imágenes actuales enviadas como JSON
        const imagenesActuales = data.imagenes_actuales
            ? JSON.parse(data.imagenes_actuales).map((url) => {
                const fileName = url.split('/').pop();
                return `/uploads/productos/${fileName}`;
            })
            : [];

        // Combinar imágenes actuales y nuevas
        const imagenesFinales = [...imagenesActuales, ...nuevasImagenes];
        const imagenesUnicas = [...new Set(imagenesFinales.filter(Boolean))];

        // Verificar y convertir el valor de descuento
        const descuento = data.descuento === "null" || data.descuento === null ? null : Number(data.descuento);
        if (descuento !== null && isNaN(descuento)) {
            return res.status(400).send({ message: "Descuento debe ser un número o null." });
        }

        // Manejar variantes: Normalizar str_variedad para que siempre sea un array
        let nuevasVariedades = [];
        if (data.str_variedad) {
            nuevasVariedades = typeof data.str_variedad === "string"
                ? data.str_variedad.split(/[,.\n]/).map((v) => v.trim()).filter(Boolean)
                : Array.isArray(data.str_variedad)
                    ? data.str_variedad.map((v) => v.trim())
                    : [];
        }

        // Obtener las variantes actuales desde la base de datos
        const productoExistenteVariantes = await Producto.findById(id).select('variantes');

        let variantesActuales = productoExistenteVariantes?.variantes || [];

        const stockGlobal = parseInt(data.stock) || 0;
        const stockDistribuido = nuevasVariedades.length > 0
            ? Math.floor(stockGlobal / nuevasVariedades.length) // Stock distribuido
            : 0;

        // Agregar nuevas variantes o actualizar existentes
        nuevasVariedades.forEach((variedad, index) => {
            const existente = variantesActuales.find((v) => v.nombre === variedad);
            if (!existente) {
                variantesActuales.push({
                    nombre: variedad,
                    precio: data.precio || 0, // Precio base si no está definido
                    stock: stockGlobal > 0 ? stockDistribuido : 0, // Asignar stock distribuido
                });
            } else {
                // Si ya existe, actualizar su stock
                if (stockGlobal > 0) {
                    existente.stock = stockDistribuido;
                }
            }

            // Ajustar residuo del stock en la última variante
            if (index === nuevasVariedades.length - 1) {
                const stockRestante = stockGlobal - stockDistribuido * nuevasVariedades.length;
                if (existente) {
                    existente.stock += stockRestante;
                } else {
                    variantesActuales[variantesActuales.length - 1].stock += stockRestante;
                }
            }
        });

        // Calcular stock total del producto
        const stockTotal = variantesActuales.reduce((acc, variante) => {
            const stockVariante = parseInt(variante.stock) || 0;
            return acc + stockVariante;
        }, 0);

        // Actualizar producto con nuevos datos
        const producto = await Producto.findByIdAndUpdate(
            id,
            {
                titulo: data.titulo,
                slug: slug,
                categoria: data.categoria,
                subcategoria: data.subcategoria,
                extracto: data.extracto,
                estado: data.estado,
                str_variedad: nuevasVariedades.join(","), // Guardar como cadena
                descuento: descuento,
                etiquetas: data.etiquetas || [],
                variantes: variantesActuales,
                imagenes: imagenesUnicas,
                stock: stockTotal, // Stock total calculado
            },
            { new: true }
        );

        if (!producto) {
            return res.status(404).send({ data: undefined, message: "Producto no encontrado." });
        }

        return res.status(200).send({
            data: producto,
            message: "Producto actualizado exitosamente.",
        });
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        return res.status(500).send({ data: undefined, message: "No se pudo actualizar el producto." });
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

const eliminar_producto_admin = async function (req, res) {
    if (!req.user) {
        return res.status(403).send({ data: undefined, message: 'ErrorToken' });
    }

    const id = req.params['id'];

    try {
        // Verificar si el producto existe
        const producto = await Producto.findById(id);

        if (!producto) {
            return res.status(404).send({ data: undefined, message: 'Producto no encontrado.' });
        }

        // Eliminar imágenes asociadas al producto
        if (producto.imagenes && producto.imagenes.length > 0) {
            for (const imagen of producto.imagenes) {
                const path_img = `./uploads/productos/${imagen}`;
                if (fs.existsSync(path_img)) {
                    fs.unlinkSync(path_img);
                }
            }
        }

        // Eliminar el producto
        await Producto.findByIdAndDelete(id);

        res.status(200).send({ data: producto, message: 'Producto eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).send({ data: undefined, message: 'Error interno al eliminar el producto.' });
    }
};


module.exports = {
    registrar_producto_admin,
    listar_productos_admin,
    obtener_producto_admin,
    actualizar_producto_admin,
    registro_variedad_producto,
    obtener_variedad_producto,
    eliminar_variedad_producto,
    eliminar_producto_admin,

}