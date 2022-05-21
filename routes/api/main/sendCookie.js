var express = require('express');
var router = express.Router();

const upload = require('../../../module/multer.js')

/*crypto : 암호화모듈 */
const crypto = require('crypto-promise');

/* 결과값 출력 모듈 세가지*/
const defaultRes = require('../../../module/utils/utils'); 
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage')
/* db 연결 모듈 */
const db = require('../../../module/pool');
const moment = require('moment');
const randomNum = require('../auth/randomNum');
router.post('/:userid', async (req, res) => {
    var userid = req.params.userid;
    var otherid = req.body.userid;
    
    const InsertQuery = 'insert into Cookie(SendID, ReceiveID) values (?,?)';
    const InsertQueryResult = await db.queryParam_Arr(InsertQuery, [userid,otherid])
    console.log(InsertQueryResult)

    const SelectMatchQuery = 'select SendID, ReceiveId from Cookie where SendID = ? and ReceiveID = ?';
    const SelectMatchQueryResult = await db.queryParam_Arr(SelectMatchQuery, [otherid,userid])
    var InsertQuery2 = ""
    var InsertQueryResult2 = ""

    if(!InsertQueryResult){
        res.status(200).send(defaultRes.successFalse(200, "쿠키를 보내지 못했습니다."));
    }
    else{
        if(!SelectMatchQueryResult[0]){
            res.status(200).send(defaultRes.successTrue(200, "쿠키를 보냈습니다, 매치는 안된 상태."));
        }
        else{    

            while(1){
                var Chatroom = randomNum.authNo(0,9,3);
                // 중복되는 채팅룸 번호 확인하기
                const FindDuplicateQuery = 'select ChatRoom from Chat where ChatRoom = ?'
                const FindDuplicateQueryResult = await db.queryParam_Arr(FindDuplicateQuery, [Chatroom]);
                console.log(FindDuplicateQueryResult);
                if(FindDuplicateQueryResult != []){
                    InsertQuery2 = 'Insert into Chat(SendID, ReceiveID, Message, Date, ChatRoom) values (?,?,?,?,?)';
                    InsertQueryResult2 =await db.queryParam_Arr(InsertQuery2, [userid, otherid, "채팅방이 개설되었습니다~",moment().format('YYYY-MM-DD'), Chatroom]);
                    break;
                }
                else{
                    // InsertQuery2 = 'Insert into Chat(SendID, ReceiveID, Message, Date, ChatRoom) values (?,?,?,?,?)';
                    // InsertQueryResult2 =await db.queryParam_Arr(InsertQuery2, [userid, otherid, "채팅방이 개설되었습니다~",moment().format('YYYY-MM-DD'), Chatroom]);
                    // break;
                }
            }
            res.status(200).send(defaultRes.successTrue(200, "매치가 되었습니다.", InsertQueryResult2));
        }
    }
});

module.exports = router;

