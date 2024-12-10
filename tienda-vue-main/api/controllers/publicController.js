const Producto = require('../models/producto');
const Categoria = require('../models/categoria');
const Subcategoria = require('../models/subcategoria');

// Obtener los últimos 4 productos
const obtener_nuevos_productos = async function (req, res) {
    try {
        const productos = await Producto.find({ estado: true })
            .sort({ createdAt: -1 })
            .limit(4);
        res.status(200).send({ data: productos });
    } catch (error) {
        console.error(error);
        res.status(500).send({ data: [], message: 'Error al obtener los nuevos productos.' });
    }
};

// Obtener 8 productos recomendados
const obtener_productos_recomendados = async function (req, res) {
    try {
        const productos = await Producto.find({ estado: true }).limit(8);
        res.status(200).send({ data: productos });
    } catch (error) {
        console.error(error);
        res.status(500).send({ data: [], message: 'Error al obtener productos recomendados.' });
    }
};

// Listar todos los productos para la tienda (shop)
const obtener_productos_shop = async function (req, res) {
    try {
        const productos = await Producto.find({ estado: true }).sort({ createdAt: -1 });
        res.status(200).send({ data: productos });
    } catch (error) {
        console.error(error);
        res.status(500).send({ data: [], message: 'Error al obtener productos para la tienda.' });
    }
};

// Listar categorías públicas con sus subcategorías y cantidad de productos
const listar_categorias_public = async function (req, res) {
    try {
        // Obtener las categorías visibles
        const categorias = await Categoria.find({ estado: true })
            .sort({ titulo: 1 })
            .lean();

        // Procesar cada categoría para incluir subcategorías y cantidad de productos
        const response = await Promise.all(
            categorias.map(async (categoria) => {
                const subcategorias = await Subcategoria.find({ categoria: categoria._id, estado: true }).lean();
                const nproductos = await Producto.countDocuments({ categoria: categoria.titulo });
                return {
                    categoria,
                    subcategorias,
                    nproductos,
                };
            })
        );

        res.status(200).send({ data: response });
    } catch (error) {
        console.error(error);
        res.status(500).send({ data: [], message: 'Error al listar las categorías públicas.' });
    }
};

// Listar subcategorías vinculadas a una categoría específica
const listar_subcategorias_por_categoria_public = async function (req, res) {
    try {
        const categoriaId = req.params['categoriaId'];
        const subcategorias = await Subcategoria.find({ categoria: categoriaId, estado: true }).lean();

        if (!subcategorias.length) {
            return res.status(404).send({ data: [], message: 'No se encontraron subcategorías para esta categoría.' });
        }

        res.status(200).send({ data: subcategorias });
    } catch (error) {
        console.error(error);
        res.status(500).send({ data: [], message: 'Error al listar subcategorías por categoría.' });
    }
};

module.exports = {
    obtener_nuevos_productos,
    obtener_productos_recomendados,
    obtener_productos_shop,
    listar_categorias_public,
    listar_subcategorias_por_categoria_public,
};
