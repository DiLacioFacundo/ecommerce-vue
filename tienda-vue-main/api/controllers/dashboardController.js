const Cliente = require('../models/cliente');
const Venta = require('../models/venta');
const VentaDetalle = require('../models/venta_detalle');
const Producto = require('../models/producto');
const Analytics = require('../models/analytics');

const getClientsByGender = async () => {
    try {
        const clientsByGender = await Cliente.aggregate([
            {
                $group: {
                    _id: '$genero', // Agrupar por el campo "genero"
                    cantidad: { $sum: 1 }, // Contar los clientes en cada grupo
                },
            },
        ]);

        // Formatear la respuesta para que sea más legible
        const formattedResult = clientsByGender.map((group) => ({
            genero: group._id || 'No especificado', // Si no hay género, lo indicamos
            cantidad: group.cantidad,
        }));

        return formattedResult;
    } catch (error) {
        console.error('Error al contar clientes por género:', error);
        throw error;
    }
};
const getRepeatCustomers = async () => {
    try {
        const repeatCustomers = await Venta.aggregate([
            {
                $group: {
                    _id: '$cliente', // Agrupar por cliente
                    totalCompras: { $sum: 1 }, // Contar el número de compras por cliente
                },
            },
            {
                $match: {
                    totalCompras: { $gt: 1 }, // Filtrar clientes con más de una compra
                },
            },
        ]);

        return repeatCustomers.length;
    } catch (error) {
        console.error('Error al obtener clientes recurrentes:', error);
        throw error;
    }
};

const getEarningsByCategory = async () => {
    try {
        // Agregación para obtener ingresos por categoría
        const earningsByCategory = await VentaDetalle.aggregate([
            {
                $lookup: {
                    from: 'productos', // Conectar con la colección de productos
                    localField: 'producto', // Campo local
                    foreignField: '_id', // Campo en la colección de productos
                    as: 'productoInfo', // Resultado almacenado como "productoInfo"
                },
            },
            {
                $unwind: {
                    path: '$productoInfo',
                    preserveNullAndEmptyArrays: false, // Evita nulos si el producto no existe
                },
            },
            {
                $lookup: {
                    from: 'categorias', // Conectar con la colección de categorías
                    localField: 'productoInfo.categoria', // Campo en el producto
                    foreignField: '_id', // Campo en la categoría
                    as: 'categoriaInfo', // Resultado almacenado como "categoriaInfo"
                },
            },
            {
                $unwind: {
                    path: '$categoriaInfo',
                    preserveNullAndEmptyArrays: false, // Evita nulos si la categoría no existe
                },
            },
            {
                $group: {
                    _id: '$categoriaInfo.titulo', // Agrupar por el nombre de la categoría
                    totalIngresos: { $sum: '$subtotal' }, // Sumar ingresos (asegúrate de que subtotal exista)
                },
            },
            {
                $sort: { totalIngresos: -1 }, // Ordenar los resultados por ingresos (descendente)
            },
        ]);

        // Verifica que los datos sean válidos y formatea la respuesta
        if (!earningsByCategory || earningsByCategory.length === 0) {
            return [];
        }

        // Formatear el resultado para que sea más legible
        const formattedResult = earningsByCategory.map((group) => ({
            categoria: group._id || 'Sin categoría', // Si no hay categoría, mostrar "Sin categoría"
            totalIngresos: group.totalIngresos || 0, // Asegurarse de que totalIngresos sea un número
        }));

        return formattedResult;
    } catch (error) {
        // Manejo de errores con más detalles
        console.error('Error al obtener ingresos por categoría:', {
            message: error.message,
            stack: error.stack,
        });
        throw new Error('No se pudieron obtener los ingresos por categoría');
    }
};

const getOrdersByTimeframe = async () => {
    try {
        const now = new Date();
        const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const startOfWeek = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - now.getUTCDay()));
        const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

        // Consultas separadas
        const todayOrders = await Venta.countDocuments({ createdAt: { $gte: startOfDay } });
        const weeklyOrders = await Venta.countDocuments({ createdAt: { $gte: startOfWeek } });
        const monthlyOrders = await Venta.countDocuments({ createdAt: { $gte: startOfMonth } });

        return {
            todayOrders,
            weeklyOrders,
            monthlyOrders,
        };
    } catch (error) {
        console.error('Error al obtener pedidos por intervalo de tiempo:', error);
        throw error;
    }
};

const getConversionRate = async () => {
    try {
        const totalVisitors = await Analytics.countDocuments({});
        const distinctBuyers = await Venta.distinct('cliente');
        const totalBuyers = distinctBuyers.length;

        const conversionRate = totalVisitors > 0 ? (totalBuyers / totalVisitors) * 100 : 0;
        return conversionRate.toFixed(2);
    } catch (error) {
        console.error('Error al calcular la tasa de conversión:', error);
        throw error;
    }
};


const getSalesByStatus = async () => {
    try {
        const salesByStatus = await Venta.aggregate([
            {
                $group: {
                    _id: '$estado',
                    cantidad: { $sum: 1 },
                },
            },
            {
                $sort: { cantidad: -1 },
            },
        ]);

        const formattedResult = salesByStatus.map((group) => ({
            label: group._id || 'Sin Estado',
            value: group.cantidad || 0,
        }));

        return formattedResult;
    } catch (error) {
        console.error('Error al contar ventas por estado:', error);
        throw error;
    }
};


const getTotalSales = async () => {
    try {
        const totalSales = await Venta.aggregate([
            {
                $group: {
                    _id: null,
                    totalVentas: { $sum: '$total' },
                },
            },
        ]);

        return totalSales[0]?.totalVentas || 0;
    } catch (error) {
        console.error('Error al calcular el total de ventas:', error);
        throw error;
    }
};


const getTotalEarnings = async () => {
    try {
        const earnings = await Venta.aggregate([
            {
                $group: {
                    _id: null, // No agrupar, sumar todo
                    totalGanancias: { $sum: '$total' },
                },
            },
        ]);

        return earnings.length > 0 ? earnings[0].totalGanancias : 0;
    } catch (error) {
        console.error('Error al calcular las ganancias totales:', error);
        throw error;
    }
};

const getActiveUsers = async () => {
    try {
        const activeUsersCount = await Cliente.countDocuments({ estado: true });
        return activeUsersCount;
    } catch (error) {
        console.error('Error al calcular usuarios activos:', error);
        throw error;
    }
};


const fetchOrdersFromDatabase = async () => {
    try {
        const orders = await Venta.find();
        return orders;
    } catch (error) {
        console.error('Error al obtener pedidos de la base de datos:', error);
        throw error;
    }
};

const getLowStockProducts = async () => {
    try {
        const lowStockProducts = await Producto.find({ stock: { $lt: 10 } }).select('titulo stock');
        return lowStockProducts;
    } catch (error) {
        console.error('Error al obtener productos con bajo stock:', error);
        throw error;
    }
};

const getNewClients = async () => {
    try {
        const now = new Date();
        const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

        const newClients = await Cliente.countDocuments({ createdAt: { $gte: oneMonthAgo } });
        return newClients;
    } catch (error) {
        console.error('Error al contar nuevos clientes:', error);
        throw error;
    }
};

const getPendingOrders = async (req = null, res = null) => {
    try {
        const orders = await fetchOrdersFromDatabase();
        if (!orders || !Array.isArray(orders)) {
            throw new Error('No se encontraron pedidos o los datos son inválidos');
        }

        const pendingOrders = orders.filter(order => order.status === 'Pendiente');

        const result = pendingOrders.length > 0 ? pendingOrders : 0;

        if (res) {
            return res.status(200).json(result);
        }
        return result;
    } catch (error) {
        console.error('Error al obtener pedidos pendientes:', error);
        if (res) {
            return res.status(500).json({ message: 'Error al obtener pedidos pendientes' });
        }
        throw error;
    }
};
const getMonthlyEarnings = async () => {
    try {
        const monthlyEarnings = await Venta.aggregate([
            {
                $group: {
                    _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                    totalGanancias: { $sum: '$total' },
                },
            },
            {
                $sort: { '_id.year': -1, '_id.month': -1 }, // Ordenar por fecha
            },
            {
                $project: {
                    year: '$_id.year',
                    month: '$_id.month',
                    totalGanancias: 1,
                },
            },
        ]);
        return monthlyEarnings;
    } catch (error) {
        console.error('Error al obtener ganancias mensuales:', error);
        throw error;
    }
};

const getTopSellingProducts = async () => {
    try {
        const topProducts = await VentaDetalle.aggregate([
            {
                $group: {
                    _id: '$producto',
                    totalVentas: { $sum: '$cantidad' },
                },
            },
            {
                $sort: { totalVentas: -1 },
            },
            {
                $limit: 5,
            },
            {
                $lookup: {
                    from: 'productos',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productoInfo',
                },
            },
            {
                $unwind: '$productoInfo',
            },
            {
                $project: {
                    titulo: '$productoInfo.titulo',
                    imagen: { $arrayElemAt: ['$productoInfo.imagenes', 0] },
                    precio: '$productoInfo.precio',
                    stock: '$productoInfo.stock',
                    descripcion: '$productoInfo.extracto',
                    descuento: '$productoInfo.descuento',
                    precio_descuento: '$productoInfo.precio_descuento',
                    etiquetas: '$productoInfo.etiquetas',
                    totalVentas: 1,
                },
            },
        ]);
        return topProducts;
    } catch (error) {
        console.error('Error al obtener productos más vendidos:', error);
        throw error;
    }
};

const getCustomerRetentionRate = async () => {
    try {
        const totalCustomers = await Cliente.countDocuments({});
        const repeatCustomers = await getRepeatCustomers();

        const retentionRate =
            totalCustomers > 0 ? ((repeatCustomers / totalCustomers) * 100).toFixed(2) : 0;

        return retentionRate;
    } catch (error) {
        console.error('Error al calcular tasa de retención de clientes:', error);
        throw error;
    }
};

const getCanceledOrders = async () => {
    try {
        const canceledOrders = await Venta.countDocuments({ estado: 'Cancelada' });
        return canceledOrders;
    } catch (error) {
        console.error('Error al obtener pedidos cancelados:', error);
        throw error;
    }
};

const getDashboardData = async (req, res) => {
    try {
        const safeCall = async (fn) => {
            try {
                return await fn();
            } catch (error) {
                console.error(`Error en función ${fn.name}:`, error);
                return null;
            }
        };

        const [
            totalSales,
            totalEarnings,
            pendingOrders,
            newClients,
            lowStockProducts,
            clientsByGender,
            conversionRate,
            repeatCustomers,
            earningsByCategory,
            ordersByTimeframe,
            salesByStatus,
            activeUsers,
            topSellingProducts,
            monthlyEarnings,
            customerRetentionRate,
            canceledOrders,
        ] = await Promise.all([
            safeCall(getTotalSales),
            safeCall(getTotalEarnings),
            safeCall(getPendingOrders),
            safeCall(getNewClients),
            safeCall(getLowStockProducts),
            safeCall(getClientsByGender),
            safeCall(getConversionRate),
            safeCall(getRepeatCustomers),
            safeCall(getEarningsByCategory),
            safeCall(getOrdersByTimeframe),
            safeCall(getSalesByStatus),
            safeCall(getActiveUsers),
            safeCall(getTopSellingProducts),
            safeCall(getMonthlyEarnings),
            safeCall(getCustomerRetentionRate),
            safeCall(getCanceledOrders),
        ]);

        const dashboardData = {
            totalSales,
            totalEarnings,
            pendingOrders,
            newClients,
            lowStockProducts,
            clientsByGender,
            conversionRate,
            repeatCustomers,
            earningsByCategory,
            ordersByTimeframe,
            salesByStatus,
            activeUsers,
            topSellingProducts,
            monthlyEarnings,
            customerRetentionRate,
            canceledOrders,
        };
        res.status(200).json(dashboardData);
    } catch (error) {
        console.error('Error al obtener datos del dashboard:', error);
        res.status(500).json({ message: 'Error al obtener datos del dashboard' });
    }
};


module.exports = {
    getDashboardData,
};
