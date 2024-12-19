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
        const earningsByCategory = await VentaDetalle.aggregate([
            {
                $lookup: {
                    from: 'productos',
                    localField: 'producto',
                    foreignField: '_id',
                    as: 'productoInfo',
                },
            },
            {
                $unwind: '$productoInfo',
            },
            {
                $lookup: {
                    from: 'categorias',
                    localField: 'productoInfo.categoria',
                    foreignField: '_id',
                    as: 'categoriaInfo',
                },
            },
            {
                $unwind: '$categoriaInfo',
            },
            {
                $group: {
                    _id: '$categoriaInfo.nombre', // Agrupar por nombre de categoría
                    totalIngresos: { $sum: '$subtotal' }, // Sumar ingresos por categoría
                },
            },
            {
                $sort: { totalIngresos: -1 }, // Ordenar por ingresos
            },
        ]);

        return earningsByCategory.map((group) => ({
            categoria: group._id,
            totalIngresos: group.totalIngresos,
        }));
    } catch (error) {
        console.error('Error al obtener ingresos por categoría:', error);
        throw error;
    }
};
const getOrdersByTimeframe = async () => {
    try {
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [todayOrders, weeklyOrders, monthlyOrders] = await Promise.all([
            Venta.countDocuments({ createdAt: { $gte: startOfDay } }),
            Venta.countDocuments({ createdAt: { $gte: startOfWeek } }),
            Venta.countDocuments({ createdAt: { $gte: startOfMonth } }),
        ]);

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
        const totalVisitors = await Analytics.countDocuments({}); // Total de visitantes registrados
        const totalBuyers = await Venta.distinct('cliente').countDocuments({});
        const conversionRate = totalVisitors > 0 ? (totalBuyers / totalVisitors) * 100 : 0;
        return conversionRate.toFixed(2); // Formatear a 2 decimales
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
                    _id: '$estado', // Agrupar por el campo "estado"
                    cantidad: { $sum: 1 }, // Contar las ventas en cada estado
                },
            },
            {
                $sort: { cantidad: -1 }, // Ordenar por la cantidad de ventas (opcional)
            },
        ]);

        // Formatear la respuesta para que sea más legible
        const formattedResult = salesByStatus.map((group) => ({
            estado: group._id || 'No especificado', // Si no hay estado, lo indicamos
            cantidad: group.cantidad,
        }));

        return formattedResult;
    } catch (error) {
        console.error('Error al contar ventas por estado:', error);
        throw error;
    }
};

const getTotalSales = async (req, res) => {
    try {
        const totalSales = await Venta.aggregate([
            {
                $group: {
                    _id: null,
                    totalVentas: { $sum: '$total' },
                },
            },
        ]);
        res.status(200).json({ totalSales: totalSales[0]?.totalVentas || 0 });
    } catch (error) {
        console.error('Error al calcular el total de ventas:', error);
        res.status(500).json({ message: 'Error al calcular el total de ventas' });
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
const getPendingOrders = async (req, res) => {
    try {
        const pendingOrders = await Venta.countDocuments({ estado: 'Pendiente' });
        res.status(200).json({ pendingOrders });
    } catch (error) {
        console.error('Error al obtener pedidos pendientes:', error);
        res.status(500).json({ message: 'Error al obtener pedidos pendientes' });
    }
};

const getDashboardData = async () => {
    try {
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
        ] = await Promise.all([
            getTotalSales(),
            getTotalEarnings(),
            getPendingOrders(), // Agregada la función aquí
            getNewClients(),
            getLowStockProducts(),
            getClientsByGender(),
            getConversionRate(),
            getRepeatCustomers(),
            getEarningsByCategory(),
            getOrdersByTimeframe(),
        ]);

        return {
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
        };
    } catch (error) {
        console.error('Error al obtener datos del dashboard:', error);
        throw error;
    }
};

module.exports = {
    getClientsByGender,
    getRepeatCustomers,
    getEarningsByCategory,
    getOrdersByTimeframe,
    getConversionRate,
    getSalesByStatus,
    getTotalSales,
    getTotalEarnings,
    getLowStockProducts,
    getNewClients,
    getDashboardData,
    getPendingOrders
};
