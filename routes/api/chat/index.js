var express = require('express');
var router = express.Router();

router.use("/getChatList", require("./getChatList"));

module.exports = router;
