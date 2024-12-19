var express = require('express');
var dashboardController = require('../controllers/dashboardController');

var authenticate = require('../middlewares/authenticate');
var router = express.Router();

// Rutas del Dashboard
router.get('/get_total_sales', authenticate.decodeToken, dashboardController.getTotalSales);
router.get('/get_total_earnings', authenticate.decodeToken, dashboardController.getTotalEarnings);
router.get('/get_pending_orders', authenticate.decodeToken, dashboardController.getPendingOrders);
router.get('/get_new_clients', authenticate.decodeToken, dashboardController.getNewClients);
router.get('/get_low_stock_products', authenticate.decodeToken, dashboardController.getLowStockProducts);
router.get('/get_clients_by_gender', authenticate.decodeToken, dashboardController.getClientsByGender);
router.get('/get_sales_by_status', authenticate.decodeToken, dashboardController.getSalesByStatus);
router.get('/get_earnings_by_category', authenticate.decodeToken, dashboardController.getEarningsByCategory);
router.get('/get_conversion_rate', authenticate.decodeToken, dashboardController.getConversionRate);
router.get('/get_repeat_customers', authenticate.decodeToken, dashboardController.getRepeatCustomers);
router.get('/get_orders_by_timeframe', authenticate.decodeToken, dashboardController.getOrdersByTimeframe);
router.get('/get_dashboard_data', authenticate.decodeToken, dashboardController.getDashboardData);

module.exports = router;
