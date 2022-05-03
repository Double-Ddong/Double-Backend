var express = require('express');
var router = express.Router();

router.use('/auth', require('./auth/index'));
router.use('/setting', require('./setting/index'));

module.exports = router;