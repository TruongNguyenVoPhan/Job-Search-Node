var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/CV',require('./CV'));
router.use('/users',require('./users'));
router.use('/auth',require('./auth'));
router.use('/Job',require('./Job'));
router.use('/Application',require('./Application'));
module.exports = router;
