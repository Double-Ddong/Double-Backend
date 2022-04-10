var express = require('express');
var router = express.Router();

router.use("/signup", require("./signup"));
router.use("/signin", require("./signin"));
router.use("/signupProfile", require("./signupProfile"));

module.exports = router;