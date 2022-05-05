var express = require('express');
var router = express.Router();

router.use("/signup", require("./signup"));
router.use("/signin", require("./signin"));
router.use("/signupProfile", require("./signupProfile"));
router.use("/signupProfileImg", require("./signupProfileImg"));
router.use("/signupPhoneAuth", require("./signupPhoneAuth"));
router.use("/findID", require("./findID"));
router.use("/findPW", require("./findPW"));
router.use("/univMailAuth", require("./univMailAuth"));
router.use("/getUnivName", require("./getUnivName"));

module.exports = router;
