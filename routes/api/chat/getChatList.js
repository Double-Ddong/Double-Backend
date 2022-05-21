var express = require('express');
var router = express.Router();

const defaultRes = require('../../../module/utils/utils');
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage')
const db = require('../../../module/pool');
const crypto = require('crypto-promise');

router.get('/:UserId', async (req, res) => {
    const userid = req.params.UserId;

    const selectChatlenQuery = 'SELECT DISTINCT ChatRoom FROM DoubleDDong.Chat WHERE ReceiveID = ?'
    const selectChatlenResult = await db.queryParam_Parse(selectChatlenQuery, userid);

    if(selectChatlenResult[0]) {
        const selectChatQuery = 'SELECT Message, Date, ChatRoom, NickName, Profile '+
                                    'FROM Chat, User '+
                                    'WHERE ReceiveID = ? AND SendID = UserId '+
                                    'ORDER BY ChatRoom, Date'
        const selectChatResult = await db.queryParam_Parse(selectChatQuery, userid);
        if(selectChatResult) {
            res.status(200).send(defaultRes.successTrue(200, selectChatResult));
        }

    }else {
        res.status(200).send(defaultRes.successFalse(statusCode.OK, "채팅방이 존재하지 않습니다."));
    }

});

module.exports = router;