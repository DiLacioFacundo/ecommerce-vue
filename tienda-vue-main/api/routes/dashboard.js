var express = require('express');
var dashboardController = require('../controllers/dashboardController');

var authenticate = require('../middlewares/authenticate');
var router = express.Router();

router.get('/get_dashboard_data', authenticate.decodeToken, dashboardController.getDashboardData);

module.exports = router;
