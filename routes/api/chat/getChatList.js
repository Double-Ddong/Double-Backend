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
        var returnResult = [];

        for(var i=0; i<selectChatlenResult.length; i++){
            const selectChatQuery = 'SELECT Message, timestampdiff(MINUTE, NOW(), Date) as Date, ChatRoom, NickName, UserId, Profile '+
                                    'FROM Chat, User '+
                                    'WHERE (ReceiveID = ? OR SendID = ?) AND SendId = UserID AND ChatRoom = ? '+
                                    'ORDER BY ChatRoom, Date'
            const selectChatResult = await db.queryParam_Parse(selectChatQuery, [userid, userid, selectChatlenResult[i].ChatRoom]);
            
            returnResult.push(selectChatResult);
        }

        // for(var i=0; i<selectChatlenResult.length; i++){
        //     const selectChatQuery = 'SELECT Message, timestampdiff(MINUTE, NOW(), Date) as Date, ChatRoom, NickName, Profile '+
        //                             'FROM Chat, User '+
        //                             'WHERE SendID = ? AND SendID = UserId AND ChatRoom = ? '+
        //                             'ORDER BY ChatRoom, Date'
        //     const selectChatResult = await db.queryParam_Parse(selectChatQuery, [userid, selectChatlenResult[i].ChatRoom]);
            
        //     returnResult.push(selectChatResult);
        // }


        res.status(200).send(defaultRes.successTrue(200, [selectChatlenResult.length, returnResult]));
        

    }else {
        res.status(200).send(defaultRes.successFalse(statusCode.OK, "채팅방이 존재하지 않습니다."));
    }

});

module.exports = router;