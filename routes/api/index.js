var express = require('express');
var router = express.Router();

router.use('/auth', require('./auth/index'));
router.use('/main', require('./main/index'));

module.exports = router;