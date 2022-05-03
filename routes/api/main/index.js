var express = require('express');
var router = express.Router();

router.use('/tab', require('./tab'));
router.use('/mainpage1', require('./mainpage1'));
router.use('/mainpage2', require('./mainpage2'));
router.use('/mainpage3', require('./mainpage3'));
router.use('/cookie', require('./cookie'));


module.exports = router;