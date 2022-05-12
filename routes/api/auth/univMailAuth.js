var express = require('express');
var router = express.Router();

const crypto = require('crypto-promise');

const defaultRes = require('../../../module/utils/utils');
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage')
const db = require('../../../module/pool');

const jwtUtils = require('../../../module/jwt');

const mailSend = require('./mailTransport');
const randomNum = require('./randomNum');

router.post('/', async (req, res) => {
    const email = req.body.Email;
    var sendNum = randomNum.authNo(0,9,4);
    mailSend.sendMailNum(email, sendNum);

    res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SEND_MAIL_SUCCESS, {sendNum}));
});

module.exports = router;
