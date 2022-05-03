var express = require('express');
var router = express.Router();

router.use("/settingMain", require("./settingMain"));
router.use("/modifyProfile", require("./modifyProfile"));
router.use("/setScope", require("./setScope"));
router.use("/deleteUser", require("./deleteUser"));

module.exports = router;
