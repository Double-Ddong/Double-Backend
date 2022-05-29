var express = require('express');
var router = express.Router();

router.use("/getChatList", require("./getChatList"));
router.use("/putChatMessage", require("./putChatMessage"));

module.exports = router;
