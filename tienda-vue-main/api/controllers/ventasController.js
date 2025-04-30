const mongoose = require('mongoose');
const Venta = require('../models/venta');
const Venta_Detalle = require('../models/venta_detalle');
const Direccion = require('../models/direccion');
const Producto = require('../models/producto');

// Controladores
const obtener_ventas_admin = async function (req, res) {
    try {
        if (!req.user) {
            return res.status(403).send({ message: "No autorizado." });
        }

        const filtro = req.query.filtro || "all"; // Parámetro opcional desde el frontend
        const hoy = new Date();
        let inicio, hasta;

        switch (filtro) {
            case "today":
                inicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
                hasta = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
                break;
            case "week":
                inicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - 7);
                hasta = hoy;
                break;
            case "month":
                inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
                hasta = hoy;
                break;
            default:
                inicio = req.query.inicio
                    ? new Date(`${req.query.inicio}T00:00:00Z`)
                    : new Date(0);
                hasta = req.query.hasta
                    ? new Date(`${req.query.hasta}T23:59:59Z`)
                    : hoy;
                break;
        }

        const ventas = await Venta.find({
            createdAt: {
                $gte: inicio,
                $lte: hasta,
            },
        })
            .populate("cliente")
            .populate("direccion");

        res.status(200).send(ventas);
    } catch (error) {
        res.status(500).send({ message: "Error al obtener ventas." });
    }
};

const obtener_detalles_venta_admin = async function (req, res) {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: 'ID de venta no válido' });
        }

        // Buscar la venta
        const venta = await Venta.findById(id).populate('cliente').populate('direccion');
        if (!venta) {
            return res.status(404).send({ message: 'Venta no encontrada' });
        }

        // Buscar los detalles de la venta
        let detalles = await Venta_Detalle.find({ venta: id }).populate({
            path: 'producto',
            select: 'titulo precio imagenes variantes',
        });

        // Para cada detalle, procesar la información incluyendo la primera imagen
        detalles = detalles.map((detalle) => {
            const primeraImagen = detalle.producto.imagenes?.[0] || '';
            if (detalle.variedad) {
                const variedadCompleta = detalle.producto.variantes.find(
                    (variedad) => variedad._id.toString() === detalle.variedad.toString()
                );

                return {
                    ...detalle.toObject(),
                    producto: {
                        titulo: detalle.producto.titulo,
                        precio: detalle.producto.precio,
                        imagen: primeraImagen, // Incluye la primera imagen
                    },
                    variedad: variedadCompleta || null,
                };
            }

            return {
                ...detalle.toObject(),
                producto: {
                    titulo: detalle.producto.titulo,
                    precio: detalle.producto.precio,
                    imagen: primeraImagen, // Incluye la primera imagen
                },
            };
        });

        res.status(200).send({ venta, detalles });
    } catch (error) {
        res.status(500).send({ message: 'Error interno al obtener detalles de la venta' });
    }
};

const actualizar_estado_venta = async function (req, res) {
    try {
        const { id, estado } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: 'ID de venta no válido.' });
        }

        const ventaActualizada = await Venta.findByIdAndUpdate(
            id,
            { estado },
            { new: true }
        );

        if (!ventaActualizada) {
            return res.status(404).send({ message: 'Venta no encontrada.' });
        }

        res.status(200).send({ message: 'Estado de la venta actualizado correctamente.', venta: ventaActualizada });
    } catch (error) {
        res.status(500).send({ message: 'Error al actualizar el estado de la venta.', error: error.message });
    }
};

const guardar_venta = async function (req, res) {
    try {


        const clienteId = req.user._id;
        const { direccion, total, envio, detalles } = req.body;

        // Validar campos mínimos
        if (!direccion || !detalles || detalles.length === 0 || !total || !envio) {
            return res.status(400).send({ message: "Datos incompletos para procesar la venta." });
        }

        // 1. Guardar dirección
        const direccionGuardada = await new Direccion({
            nombreCompleto: direccion.nombreCompleto,
            telefono: direccion.telefono,
            pais: direccion.pais,
            ciudad: direccion.ciudad,
            codigoPostal: direccion.codigoPostal,
            direccion: direccion.direccion,
            cliente: clienteId,
        }).save();


        // 2. Crear venta principal
        const ventaGuardada = await new Venta({
            transaccion: `MP-${Date.now()}`,
            serie: Date.now(),
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate(),
            total,
            envio,
            estado: "Pendiente", // podés actualizarlo luego según el pago
            cliente: clienteId,
            direccion: direccionGuardada._id,
        }).save();


        // 3. Procesar detalles del carrito
        const detallesGuardados = await Promise.all(detalles.map(async (detalle, index) => {

            const productoId = detalle.producto?.trim();
            if (!mongoose.Types.ObjectId.isValid(productoId)) {
                throw new Error(`ID de producto inválido: ${productoId}`);
            }

            const producto = await Producto.findById(productoId);
            if (!producto) {
                throw new Error(`Producto no encontrado: ${productoId}`);
            }

            let variedadId = null;
            if (detalle.variedad?.variedad) {
                const variante = producto.variantes.find(v => v.nombre === detalle.variedad.variedad);
                if (!variante) throw new Error(`Variante no encontrada: ${detalle.variedad.variedad}`);
                if (variante.stock < detalle.cantidad) {
                    throw new Error(`Stock insuficiente para la variante ${variante.nombre}`);
                }
                variante.stock -= detalle.cantidad;
                variedadId = variante._id;
            }

            if (producto.stock < detalle.cantidad) {
                throw new Error(`Stock insuficiente para el producto ${producto.titulo}`);
            }

            producto.stock -= detalle.cantidad;
            producto.markModified('variantes');
            await producto.save();

            const subtotal = detalle.cantidad * detalle.precio_unidad;

            const nuevoDetalle = new Venta_Detalle({
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
                day: new Date().getDate(),
                subtotal,
                precio_unidad: detalle.precio_unidad,
                cantidad: detalle.cantidad,
                venta: ventaGuardada._id,
                cliente: clienteId,
                producto: productoId,
                variedad: variedadId,
            });

            const detalleGuardado = await nuevoDetalle.save();
            return detalleGuardado;
        }));

        // 4. Respuesta final
        res.status(200).send({
            message: "Venta guardada correctamente.",
            venta: ventaGuardada,
            detalles: detallesGuardados,
        });

    } catch (error) {
        res.status(500).send({
            message: "Error al guardar la venta.",
            error: error.message || error,
        });
    }
};


module.exports = {
    guardar_venta,
    obtener_ventas_admin,
    obtener_detalles_venta_admin,
    actualizar_estado_venta
};
