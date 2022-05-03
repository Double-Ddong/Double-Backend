var express = require('express');
var router = express.Router();

const defaultRes = require('../../../module/utils/utils');
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage')
const db = require('../../../module/pool');

router.get('/:UserId', async (req, res) => {
    const userid = req.params.UserId;

    const selectUserQuery = 'SELECT Profile, NickName FROM User WHERE UserId = ?'
    const selectUserResult = await db.queryParam_Parse(selectUserQuery, userid);

    const profile = selectUserResult[0].Profile;
    const nickname = selectUserResult[0].NickName;

    if(selectUserResult[0]) {
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.USER_SELECTED, [profile, nickname]));
    } else {
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.EMAIL_NOT_FOUND));
    }

});

module.exports = router;