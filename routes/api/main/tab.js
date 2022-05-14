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


router.get('/:userid', async (req, res) => {
    var userid = req.params.userid;
    const getTabQuery = 'SELECT NickName, Profile, SendCookie, ReceiveCookie FROM User where UserId = ?';
    const getTabQueryResult = await db.queryParam_Arr(getTabQuery, userid);
    if(!getTabQueryResult){
        res.status(200).send(defaultRes.successFalse(200, resMessage.SELECT_CONTENT_FAILED));
    }
    else{
        res.status(200).send(defaultRes.successTrue(200, resMessage.SELECT_CONTENT_SUCCESS, getTabQueryResult));
    }
});



module.exports = router;

