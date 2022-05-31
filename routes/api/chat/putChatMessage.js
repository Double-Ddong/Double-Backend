var express = require('express');
var router = express.Router();

const defaultRes = require('../../../module/utils/utils');
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage')
const db = require('../../../module/pool');
const crypto = require('crypto-promise');
const moment = require('moment');

router.post('/', async (req, res) => {
    const SendID = req.body.SendID;
    const ReceiveID = req.body.ReceiveID; 
    const Message = req.body.Message;
    const ChatRoom = req.body.ChatRoom;

    const InsertQuery = 'Insert into Chat(SendId,ReceiveId,Message,Date,ChatRoom) values (?,?,?,?,?)';
    const InsertQueryResult = await db.queryParam_Parse(InsertQuery, [SendID, ReceiveID, Message, moment().format('YYYY-MM-DD HH:mm:ss'),ChatRoom]);

    if(InsertQueryResult[0]) {
        res.status(200).send(defaultRes.successFalse(statusCode.OK, "채팅DB로 메세지 전송 실패" ));
    }else {
        res.status(200).send(defaultRes.successTrue(200, "채팅DB로 메세지 전송 성공"));
    }

});

module.exports = router;