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

router.get('/receive/:userid', async (req, res) => {
    var userid = req.params.userid;
    
    const getCountQuery = 'select count(*) as count from Cookie where ReceiveID = ?';
    const getCountQueryResult = await db.queryParam_Arr(getCountQuery, userid)
    console.log(getCountQueryResult)
    const count = getCountQueryResult[0].count


    const getReceiveQuery = 
    'select U.UserId, U.Profile, U.NickName, U.University, U.Department ' +
    'from User U' +
    ' where U.UserId in (select C.SendID from Cookie C where C.ReceiveID = ?)'
    const getReceiveQueryResult = await db.queryParam_Arr(getReceiveQuery, userid)
    console.log(getReceiveQueryResult)
    if(!getCountQueryResult || !getReceiveQueryResult){
        res.status(200).send(defaultRes.successFalse(200, resMessage.SELECT_CONTENT_FAILED));
    }
    else{
        res.status(200).send(defaultRes.successTrue(200, resMessage.SELECT_CONTENT_SUCCESS, [getCountQueryResult,getReceiveQueryResult]));
    }
});


router.get('/send/:userid', async (req, res) => {
    var userid = req.params.userid;
    
    const getCountQuery = 'select count(*) as count from Cookie where SendID = ?';
    const getCountQueryResult = await db.queryParam_Arr(getCountQuery, userid)
    const count = getCountQueryResult[0].count


    const getReceiveQuery = 
    'select U.UserId, U.Profile, U.NickName, U.University, U.Department ' +
    'from User U' +
    ' where U.UserId in (select C.ReceiveID from Cookie C where C.SendID = ?)'
    const getReceiveQueryResult = await db.queryParam_Arr(getReceiveQuery, userid)
    if(!getCountQueryResult || !getReceiveQueryResult){
        res.status(200).send(defaultRes.successFalse(200, resMessage.SELECT_CONTENT_FAILED));
    }
    else{
        res.status(200).send(defaultRes.successTrue(200, resMessage.SELECT_CONTENT_SUCCESS, [getCountQueryResult,getReceiveQueryResult]));
    }
});

router.get('/match/:userid/:otherid', async (req, res) => {
    var userid = req.params.userid;
    var otherid = req.params.otherid;
    console.log(userid)
    console.log(otherid)
    const getCountQuery = 'SELECT UserId1, UserId2 FROM DoubleDDong.Match where UserId1 = ? and UserId2 = ?';
    const getCountQueryResult = await db.queryParam_Arr(getCountQuery, [userid, otherid])
    const getCountQuery2 = 'SELECT UserId1, UserId2 FROM DoubleDDong.Match where UserId1 = ? and UserId2 = ?';
    const getCountQueryResult2 = await db.queryParam_Arr(getCountQuery2,[otherid,userid])
    console.log(getCountQueryResult);
    if(!getCountQueryResult[0] && !getCountQueryResult2[0]){
        res.status(200).send(defaultRes.successTrue(200,["매치가 안된 상태", getCountQueryResult, getCountQueryResult2]));
    }
    else{
        res.status(200).send(defaultRes.successTrue(200, ["매치가 된 상태",getCountQueryResult, getCountQueryResult2]));
    }
});


module.exports = router;

