var express = require('express');
var router = express.Router();

const defaultRes = require('../../../module/utils/utils');
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage')
const db = require('../../../module/pool');

router.get('/:UserId', async (req, res) => {
    const userid = req.params.UserId;

    const deleteUserQuery = 'delete from User WHERE UserId = ?'
    const deleteUserQuery2 = 'delete from Cookie WHERE ReceiveID = ?'
    const deleteUserQuery3 = 'delete from Cookie WHERE SendID = ?'
    const deleteUserQueryResult = await db.queryParam_Parse(deleteUserQuery, userid);
    const deleteUserQueryResult2 = await db.queryParam_Parse(deleteUserQuery2, userid);
    const deleteUserQueryResult3 = await db.queryParam_Parse(deleteUserQuery3, userid);


    res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.DELETE_USER));
    

});

module.exports = router;