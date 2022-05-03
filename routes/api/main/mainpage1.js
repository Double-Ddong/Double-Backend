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

router.get('/', async (req, res) => {
    var userid = req.body.userid;
    
    const getUserQuery = 'select Department,Location,MBTI from User where UserId = ?';
    const getUserQueryResult = await db.queryParam_Arr(getUserQuery, userid)

    const department = getUserQueryResult[0].Department
    const location = getUserQueryResult[0].Location
    const MBTI = getUserQueryResult[0].MBTI

    const getSimilarQuery = 'select Profile, NickName, YEAR(now())-Year(Birth)+1 as Age from User where Department = ? and not UserId = ? limit 3';
    const getSimilarQueryResult = await db.queryParam_Arr(getSimilarQuery, [department, userid]);

    const getLocationQuery = 'select Profile, NickName, YEAR(now())-Year(Birth)+1 as Age from User where Location = ? and not UserId = ? limit 3';
    const getLocationQueryResult = await db.queryParam_Arr(getLocationQuery, [location, userid]);

    
    const getMBTIQuery = 'select Profile, NickName, YEAR(now())-Year(Birth)+1 as Age from User where MBTI = ? and not UserId = ? limit 3';
    const getMBTIQueryResult = await db.queryParam_Arr(getMBTIQuery, [MBTI, userid]);


        if(!getSimilarQueryResult || !getLocationQueryResult || !getMBTIQueryResult){
            res.status(200).send(defaultRes.successFalse(200, resMessage.SELECT_CONTENT_FAILED));
        }
        else{
            res.status(200).send(defaultRes.successTrue(200, resMessage.SELECT_CONTENT_SUCCESS, [getSimilarQueryResult, getLocationQueryResult, getMBTIQueryResult]));
        }
});



module.exports = router;

