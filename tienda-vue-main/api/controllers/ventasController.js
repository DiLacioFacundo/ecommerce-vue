const mongoose = require('mongoose');
const { MercadoPagoConfig, Payment } = require('mercadopago');
const Venta = require('../models/venta');
const Venta_Detalle = require('../models/venta_detalle');
const Direccion = require('../models/direccion');
const Producto = require('../models/producto');

// Configuración del cliente de Mercado Pago
const mercadopagoConfig = new MercadoPagoConfig({
    accessToken: 'TEST-461829137274803-121714-422bec9244ce16b08daf3163306bc667-604631426',
});

const payment = new Payment(mercadopagoConfig);

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
        console.error("Error al obtener las ventas:", error);
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
        const primeraImagen = detalle.producto.imagenes?.[0] || ''; // Obtiene la primera imagen o un string vacío
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
      console.error('Error al obtener detalles de la venta:', error.message);
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
        const { cliente, direccion, total, envio, detalles } = req.body;

        // Validar cliente
        if (!mongoose.Types.ObjectId.isValid(cliente)) {
            return res.status(400).send({ message: "El ID del cliente no es válido." });
        }

        // Crear dirección
        const nuevaDireccion = new Direccion({
            nombreCompleto: direccion.nombreCompleto,
            telefono: direccion.telefono,
            pais: direccion.pais,
            ciudad: direccion.ciudad,
            codigoPostal: direccion.codigoPostal,
            direccion: direccion.direccion,
            cliente: cliente,
        });

        const direccionGuardada = await nuevaDireccion.save();

        // Crear venta
        const nuevaVenta = new Venta({
            transaccion: `MP-${Date.now()}`,
            serie: Date.now(),
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate(),
            total,
            envio,
            estado: "Pendiente",
            cliente: cliente,
            direccion: direccionGuardada._id,
        });

        const ventaGuardada = await nuevaVenta.save();

        // Procesar detalles de la venta
        const detallesGuardados = await Promise.all(
            detalles.map(async (detalle) => {
                // Asegurarse de que los IDs no tengan espacios
                let productoId = detalle.producto.split("-")[0]; // Obtener solo el ID del producto
                productoId = productoId.replace(/\s+/g, '_');  // Reemplazar espacios por guiones bajos

                // Validar ID del producto
                if (!mongoose.Types.ObjectId.isValid(productoId)) {
                    throw new Error(`El ID del producto ${productoId} no es válido.`);
                }

                // Buscar el producto por ID
                const producto = await Producto.findById(productoId);

                if (!producto) {
                    throw new Error(`Producto con ID ${productoId} no encontrado.`);
                }

                // Buscar la variante por nombre
                let variedadId = null;
                if (detalle.variedad) {
                    const variante = producto.variantes.find(
                        (v) => v.nombre === detalle.variedad.variedad
                    );
                    if (variante) {
                        variedadId = variante._id;

                        // Descontar stock de la variante
                        if (variante.stock < detalle.cantidad) {
                            throw new Error(
                                `Stock insuficiente para la variante ${variante.nombre} del producto ${producto.titulo}.`
                            );
                        }
                        variante.stock -= detalle.cantidad;
                    }
                }

                // Descontar stock total del producto
                if (producto.stock < detalle.cantidad) {
                    throw new Error(
                        `Stock total insuficiente para el producto ${producto.titulo}.`
                    );
                }
                producto.stock -= detalle.cantidad;

                // Guardar los cambios en el producto
                await producto.save();

                // Validar precio y cantidad
                if (!detalle.precio_unidad || isNaN(detalle.precio_unidad)) {
                    throw new Error(`El precio del producto ${productoId} no es válido.`);
                }

                if (!detalle.cantidad || isNaN(detalle.cantidad)) {
                    throw new Error(`La cantidad del producto ${productoId} no es válida.`);
                }

                // Calcular subtotal
                const subtotal = detalle.cantidad * detalle.precio_unidad;

                // Crear y guardar detalle de venta
                const nuevoDetalle = new Venta_Detalle({
                    year: new Date().getFullYear(),
                    month: new Date().getMonth() + 1,
                    day: new Date().getDate(),
                    subtotal,
                    precio_unidad: detalle.precio_unidad,
                    cantidad: detalle.cantidad,
                    venta: ventaGuardada._id, // Relacionar el detalle con la venta
                    cliente: cliente,
                    producto: productoId, // Usar el ID del producto corregido
                    variedad: variedadId || null, // Usar el ID de la variante (puede ser null)
                });

                return await nuevoDetalle.save();
            })
        );

        // Responder con el éxito
        res.status(200).send({
            message: "Venta y detalles guardados correctamente.",
            venta: ventaGuardada,
            detalles: detallesGuardados,
        });
    } catch (error) {
        console.error("Error al guardar la venta:", error.message || error);
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
