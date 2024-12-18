const Categoria = require('../models/categoria');
const Subcategoria = require('../models/subcategoria');
const Producto = require('../models/producto');

// Registrar una nueva categoría
const registrar_categoria_admin = async (req, res) => {
    try {
        const data = req.body;

        // Verificar si el título ya existe
        const existeCategoria = await Categoria.findOne({ titulo: data.titulo });
        if (existeCategoria) {
            return res.status(400).send({ data: undefined, message: 'La categoría ya existe.' });
        }

        // Crear categoría
        const nuevaCategoria = await Categoria.create(data);
        return res.status(201).send({ data: nuevaCategoria, message: 'Categoría creada exitosamente.' });

    } catch (error) {
        console.error(error);
        res.status(500).send({ data: undefined, message: 'Error al registrar la categoría.' });
    }
};

// Listar todas las categorías con sus subcategorías
const listar_categorias_admin = async (req, res) => {
    try {
        const categorias = await Categoria.find().sort({ createdAt: -1 }).lean();

        const response = await Promise.all(
            categorias.map(async (categoria) => {
                const subcategorias = await Subcategoria.find({ categoria: categoria._id }).lean();
                return { categoria, subcategorias };
            })
        );

        return res.status(200).json({ categorias: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al listar las categorías.', error: error.message });
    }
};

// Actualizar una categoría
const actualizar_categoria_admin = async (req, res) => {
    try {
        const id = req.params['id'];
        const data = req.body;

        const categoriaActualizada = await Categoria.findByIdAndUpdate(
            id,
            { titulo: data.titulo, estado: data.estado },
            { new: true }
        );

        if (!categoriaActualizada) {
            return res.status(404).send({ data: undefined, message: 'Categoría no encontrada.' });
        }

        return res.status(200).send({ data: categoriaActualizada, message: 'Categoría actualizada exitosamente.' });

    } catch (error) {
        console.error(error);
        res.status(500).send({ data: undefined, message: 'Error al actualizar la categoría.' });
    }
};

// Eliminar una categoría y sus subcategorías
const eliminar_categoria_admin = async (req, res) => {
    try {
        const id = req.params['id'];

        const categoria = await Categoria.findById(id);
        if (!categoria) {
            return res.status(404).send({ data: undefined, message: 'Categoría no encontrada.' });
        }

        // Obtener o crear la categoría "Sin categoría"
        const sinCategoria = await obtenerCategoriaSinCategoria();

        // Actualizar los productos relacionados a "Sin categoría"
        await Producto.updateMany({ categoria: id }, { categoria: sinCategoria._id });

        // Eliminar todas las subcategorías asociadas
        await Subcategoria.deleteMany({ categoria: id });

        // Eliminar la categoría
        await Categoria.findByIdAndDelete(id);

        return res.status(200).send({ data: categoria, message: 'Categoría eliminada y productos asignados a "Sin categoría".' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ data: undefined, message: 'Error al eliminar la categoría.' });
    }
};

// Registrar una nueva subcategoría
const registrar_subcategoria_admin = async (req, res) => {
    try {
        const { categoria, titulo } = req.body;

        // Verificar si la subcategoría ya existe en la categoría
        const existeSubcategoria = await Subcategoria.findOne({
            categoria,
            titulo: { $regex: new RegExp(`^${titulo}$`, "i") }, // Compara el título, insensible a mayúsculas/minúsculas
        });

        if (existeSubcategoria) {
            return res.status(400).send({
                message: 'La subcategoría ya existe en esta categoría. Elige otro nombre.',
            });
        }

        // Crear la subcategoría
        const nuevaSubcategoria = await Subcategoria.create({ categoria, titulo });
        return res.status(201).send({
            data: nuevaSubcategoria,
            message: 'Subcategoría creada exitosamente.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Error al crear la subcategoría.',
        });
    }
};


// Listar subcategorías por categoría
const listar_subcategorias_por_categoria_admin = async (req, res) => {
    try {
        const categoriaId = req.params['categoriaId'];

        const subcategorias = await Subcategoria.find({ categoria: categoriaId }).sort({ createdAt: -1 });

        return res.status(200).send({ data: subcategorias });
    } catch (error) {
        console.error(error);
        res.status(500).send({ data: undefined, message: 'Error al listar las subcategorías.' });
    }
};

// Eliminar una subcategoría
const eliminar_subcategoria_admin = async (req, res) => {
    try {
        const id = req.params['id'];

        const subcategoria = await Subcategoria.findByIdAndDelete(id);

        if (!subcategoria) {
            return res.status(404).send({ data: undefined, message: 'Subcategoría no encontrada.' });
        }

        // Actualizar productos relacionados para que no tengan subcategoría
        await Producto.updateMany({ subcategoria: id }, { $unset: { subcategoria: "" } });

        return res.status(200).send({ data: subcategoria, message: 'Subcategoría eliminada y productos actualizados.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ data: undefined, message: 'Error al eliminar la subcategoría.' });
    }
};

const actualizar_subcategoria_admin = async (req, res) => {
    try {
        const id = req.params['id'];
        const { titulo } = req.body;

        // Verificar si el título ya existe en la misma categoría
        const subcategoriaExistente = await Subcategoria.findOne({
            _id: { $ne: id },
            categoria: req.body.categoria,
            titulo: { $regex: new RegExp(`^${titulo}$`, "i") },
        });

        if (subcategoriaExistente) {
            return res.status(400).send({
                message: 'Ya existe otra subcategoría con el mismo título en esta categoría.',
            });
        }

        // Actualizar la subcategoría
        const subcategoriaActualizada = await Subcategoria.findByIdAndUpdate(
            id,
            { titulo },
            { new: true }
        );

        if (!subcategoriaActualizada) {
            return res.status(404).send({ message: 'Subcategoría no encontrada.' });
        }

        return res.status(200).send({
            data: subcategoriaActualizada,
            message: 'Subcategoría actualizada exitosamente.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error al actualizar la subcategoría.' });
    }
};


// Obtener una categoría por ID
const obtener_categoria_admin = async (req, res) => {
    try {
        const id = req.params['id'];

        const categoria = await Categoria.findById(id).lean();

        if (!categoria) {
            return res.status(404).send({ data: undefined, message: 'Categoría no encontrada.' });
        }

        return res.status(200).send({ data: categoria, message: 'Categoría obtenida exitosamente.' });

    } catch (error) {
        console.error(error);
        res.status(500).send({ data: undefined, message: 'Error al obtener la categoría.' });
    }
};

const obtener_categoria_sin_categoria = async (req, res) => {
    try {
        const sinCategoria = await obtenerCategoriaSinCategoria();
        return res.status(200).send({ data: sinCategoria, message: 'Categoría "Sin categoría" obtenida exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ data: undefined, message: 'Error al obtener "Sin categoría".' });
    }
};

const obtener_subcategoria_sin_subcategoria = async (req, res) => {
    try {
        const categoriaId = req.params['categoriaId'];
        const sinSubcategoria = await obtenerSubcategoriaSinSubcategoria(categoriaId);

        return res.status(200).send({
            data: sinSubcategoria,
            message: 'Subcategoría "Sin Subcategorías" obtenida exitosamente.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            data: undefined,
            message: 'Error al obtener "Sin Subcategorías".',
        });
    }
};
const obtenerCategoriaSinCategoria = async () => {
    let sinCategoria = await Categoria.findOne({ titulo: "Sin Categoría" });

    if (!sinCategoria) {
        // Crear la categoría "Sin categoría" si no existe
        sinCategoria = await Categoria.create({ titulo: "Sin Categoría" });

        // Crear la subcategoría "Sin subcategorías" dentro de esta categoría
        await Subcategoria.create({
            categoria: sinCategoria._id,
            titulo: "Sin Subcategorías",
        });
    } else {
        // Verificar si la subcategoría "Sin Subcategorías" ya existe
        const sinSubcategoria = await Subcategoria.findOne({
            categoria: sinCategoria._id,
            titulo: "Sin Subcategorías",
        });

        if (!sinSubcategoria) {
            // Crear la subcategoría "Sin subcategorías" si no existe
            await Subcategoria.create({
                categoria: sinCategoria._id,
                titulo: "Sin Subcategorías",
            });
        }
    }

    return sinCategoria;
};


const obtenerSubcategoriaSinSubcategoria = async (categoriaId) => {
    // Buscar una subcategoría llamada "Sin subcategorías" dentro de la categoría especificada
    let sinSubcategoria = await Subcategoria.findOne({
        categoria: categoriaId,
        titulo: "Sin Subcategorías",
    });

    if (!sinSubcategoria) {
        // Crear la subcategoría "Sin subcategorías" si no existe
        sinSubcategoria = await Subcategoria.create({
            categoria: categoriaId,
            titulo: "Sin Subcategorías",
        });
    }

    return sinSubcategoria;
};

module.exports = {
    registrar_categoria_admin,
    listar_categorias_admin,
    actualizar_categoria_admin,
    eliminar_categoria_admin,
    registrar_subcategoria_admin,
    listar_subcategorias_por_categoria_admin,
    eliminar_subcategoria_admin,
    actualizar_subcategoria_admin,
    obtener_categoria_admin,
    obtener_categoria_sin_categoria,
    obtener_subcategoria_sin_subcategoria
};
