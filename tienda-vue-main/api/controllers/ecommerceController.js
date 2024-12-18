const Producto = require('../models/producto');
const Categoria = require('../models/categoria');
const Subcategoria = require('../models/subcategoria');
const { Types } = require('mongoose');

// Obtener los últimos 8 productos
const obtener_nuevos_productos = async (req, res) => {
    try {
        const productos = await Producto.find({
            estado: true,
            stock: { $gt: 0 }
        })
            .populate({ path: 'categoria', select: 'titulo' })
            .sort({ createdAt: -1 })
            .limit(8) // Limitar a 8 productos
            .lean();

        // Procesar las variantes y recalcular el stock total
        const productosProcesados = productos.map((producto) => {
            const variantesFiltradas = producto.variantes
                ? producto.variantes.filter((variante) => variante.stock > 0)
                : [];

            if (variantesFiltradas.length === 0) return null;

            const stockTotal = variantesFiltradas.reduce((acc, variante) => acc + variante.stock, 0);

            return {
                ...producto,
                variantes: variantesFiltradas,
                stock: stockTotal,
                imagen: Array.isArray(producto.imagenes) && producto.imagenes.length > 0
                    ? producto.imagenes[0]
                    : '/assets/images/no_image.png'
            };
        }).filter((producto) => producto !== null);

        res.status(200).send({ data: productosProcesados });
    } catch (error) {
        console.error("Error al obtener nuevos productos:", error);
        res.status(500).send({
            data: [],
            message: 'Error al obtener los nuevos productos.',
            error: error.message
        });
    }
};


// Obtener 8 productos recomendados
const obtener_productos_recomendados = async (req, res) => {
    try {
        const productos = await Producto.find({
            estado: true,
            stock: { $gt: 0 }
        })
            .populate({ path: 'categoria', select: 'titulo' })
            .limit(8) // Limitar a 8 productos
            .lean();

        // Procesar las variantes y recalcular el stock total
        const productosProcesados = productos.map((producto) => {
            const variantesFiltradas = producto.variantes
                ? producto.variantes.filter((variante) => variante.stock > 0)
                : [];

            if (variantesFiltradas.length === 0) return null;

            const stockTotal = variantesFiltradas.reduce((acc, variante) => acc + variante.stock, 0);

            return {
                ...producto,
                variantes: variantesFiltradas,
                stock: stockTotal,
                imagen: Array.isArray(producto.imagenes) && producto.imagenes.length > 0
                    ? producto.imagenes[0]
                    : '/assets/images/no_image.png'
            };
        }).filter((producto) => producto !== null);

        res.status(200).send({ data: productosProcesados });
    } catch (error) {
        console.error("Error al obtener productos recomendados:", error);
        res.status(500).send({
            data: [],
            message: 'Error al obtener productos recomendados.',
            error: error.message
        });
    }
};


// Listar todos los productos para la tienda (shop)
const obtener_productos_shop = async function (req, res) {
    try {
        const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
        const perPage = parseInt(req.query.perPage) > 0 ? parseInt(req.query.perPage) : 12;

        const filters = {
            estado: true,
            stock: { $gt: 0 },
        };

        if (req.query.subcategoriaId) {
            filters.subcategoria = req.query.subcategoriaId; // Filtrar por subcategoría si se proporciona
        }

        const [productos, total] = await Promise.all([
            Producto.find(filters)
                .populate("subcategoria", "titulo") // Popular el campo subcategoria
                .skip((page - 1) * perPage)
                .limit(perPage)
                .lean(),
            Producto.countDocuments(filters),
        ]);

        // Procesar productos: Filtrar variantes sin stock y configurar imagen
        const productosProcesados = productos
            .map((producto) => {
                const variantesFiltradas = producto.variantes?.filter((variante) => variante.stock > 0) || [];

                // Excluir productos sin variantes disponibles
                if (variantesFiltradas.length === 0) return null;

                return {
                    ...producto,
                    variantes: variantesFiltradas,
                    imagen:
                        Array.isArray(producto.imagenes) && producto.imagenes.length > 0
                            ? producto.imagenes[0]
                            : "/assets/images/no_image.png",
                };
            })
            .filter((producto) => producto !== null);

        res.status(200).send({
            success: true,
            message: "Productos obtenidos exitosamente.",
            data: productosProcesados,
            pagination: {
                total,
                currentPage: page,
                perPage,
                totalPages: Math.ceil(total / perPage),
            },
        });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send({
            success: false,
            message: "Error al obtener productos.",
            data: [],
        });
    }
};


// Listar categorías públicas con sus subcategorías y cantidad de productos
const listar_categorias_public = async function (req, res) {
    try {
        const response = await Categoria.aggregate([
            { $match: { estado: true, titulo: { $ne: "Sin Categoría" } } }, // Excluir "Sin categoría"
            {
                $lookup: {
                    from: 'subcategorias',
                    localField: '_id',
                    foreignField: 'categoria',
                    as: 'subcategorias',
                }
            },
            {
                $lookup: {
                    from: 'productos',
                    let: { categoriaId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$categoria', '$$categoriaId'] } } },
                        { $count: 'nproductos' },
                    ],
                    as: 'productos',
                }
            },
            {
                $addFields: {
                    subcategorias: { $ifNull: ['$subcategorias', []] },
                    nproductos: { $ifNull: [{ $arrayElemAt: ['$productos.nproductos', 0] }, 0] },
                }
            },
            { $project: { productos: 0 } }
        ]);

        res.status(200).send({ data: response });
    } catch (error) {
        console.error('Error en listar_categorias_public:', error.message);
        res.status(500).send({ data: [], message: 'Error al listar las categorías públicas.' });
    }
}


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

const obtener_producto_por_slug = async function (req, res) {
    try {
        // Buscar el producto por slug
        const producto = await Producto.findOne({ slug: req.params.slug }).lean();

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Filtrar las variantes con stock > 0
        const variantesFiltradas = producto.variantes
            ? producto.variantes.filter((variante) => variante.stock > 0)
            : [];

        // Procesar la imagen principal o asignar una por defecto
        const imagenPrincipal = Array.isArray(producto.imagenes) && producto.imagenes.length > 0
            ? producto.imagenes[0]
            : '/assets/images/no_image.png';

        // Construir la respuesta final
        const productoProcesado = {
            ...producto,
            variantes: variantesFiltradas,
            imagen: imagenPrincipal,
        };

        res.status(200).json(productoProcesado);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


const obtener_productos_por_categoria = async (req, res) => {
    try {
        const { categoriaId } = req.params;

        // Validar si el ID de categoría es un ObjectId válido
        if (!Types.ObjectId.isValid(categoriaId)) {
            console.error("ID de categoría inválido:", categoriaId);
            return res.status(400).send({ data: [], message: "ID de categoría inválido." });
        }

        // Verifica si la categoría existe
        const categoria = await Categoria.findById(categoriaId);
        if (!categoria) {
            console.error("Categoría no encontrada:", categoriaId);
            return res.status(404).send({ data: [], message: "Categoría no encontrada." });
        }

        // Busca las subcategorías asociadas
        const subcategorias = await Subcategoria.find({ categoria: categoriaId, estado: true }).select('_id');
        const subcategoriasIds = subcategorias.map((subcat) => subcat._id);

        // Busca productos relacionados con esas subcategorías, con estado: true y stock > 0
        const productos = await Producto.find({
            subcategoria: { $in: subcategoriasIds },
            estado: true, // Solo productos activos
            stock: { $gt: 0 }, // Stock total mayor que 0
        })
            .populate({ path: "categoria", select: "titulo" })
            .sort({ createdAt: -1 })
            .lean();

        // Procesar los productos: filtrar variantes sin stock
        const productosProcesados = productos.map((producto) => {
            const variantesFiltradas = producto.variantes?.filter((variante) => variante.stock > 0) || [];

            // Excluir productos si no tienen variantes con stock > 0
            if (variantesFiltradas.length === 0) return null;

            // Calcular nuevo stock total basado en las variantes filtradas
            const stockTotal = variantesFiltradas.reduce((acc, variante) => acc + variante.stock, 0);

            return {
                ...producto,
                variantes: variantesFiltradas,
                stock: stockTotal, // Actualizar el stock total
                imagen: Array.isArray(producto.imagenes) && producto.imagenes.length > 0
                    ? producto.imagenes[0]
                    : '/assets/images/no_image.png', // Imagen por defecto
            };
        }).filter((producto) => producto !== null); // Excluir productos sin variantes válidas

        // Verificar si no hay productos encontrados
        if (productosProcesados.length === 0) {
            return res.status(200).send({
                data: [],
                message: "No hay productos disponibles para esta categoría.",
            });
        }

        res.status(200).send({
            data: productosProcesados,
            categoria: categoria.titulo,
        });
    } catch (error) {
        console.error("Error al obtener productos por categoría:", error.message);
        res.status(500).send({
            data: [],
            message: "Error interno del servidor al obtener productos por categoría.",
            error: error.message,
        });
    }
};
const getUserOrders = async (req, res) => {
    try {
        const userId = req.params.userId; // Asumiendo que el ID del cliente viene como parámetro de ruta
        const orders = await Venta.find({ cliente: userId }).populate('direccion').lean();

        const detailedOrders = await Promise.all(orders.map(async (order) => {
            const details = await VentaDetalle.find({ venta: order._id }).populate('producto').lean();
            return {
                ...order,
                details,
            };
        }));

        res.status(200).json({ orders: detailedOrders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las órdenes del usuario.' });
    }
};


  
module.exports = {
    obtener_nuevos_productos,
    obtener_productos_recomendados,
    obtener_productos_shop,
    obtener_producto_por_slug,
    listar_categorias_public,
    obtener_productos_por_categoria,
    listar_subcategorias_por_categoria_public,
    getUserOrders
};
