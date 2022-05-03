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
const { ElasticInference } = require('aws-sdk');

router.get('/:tabIdx', async (req, res) => {

    var type = req.params.tabIdx;
    var userid = req.body.userid;
    
    const getUserQuery = 'select Department,Location,MBTI from User where UserId = ?';
    const getUserQueryResult = await db.queryParam_Arr(getUserQuery, userid)

    const department = getUserQueryResult[0].Department
    const location = getUserQueryResult[0].Location
    const MBTI = getUserQueryResult[0].MBTI
    
    if(type == 1){
        const getSimilarQuery = 'select Profile, NickName, YEAR(now())-Year(Birth)+1 as Age, Department from User where Department = ? and not UserId = ?';
        const getSimilarQueryResult = await db.queryParam_Arr(getSimilarQuery, [department, userid]);

        if(!getSimilarQueryResult){
            res.status(200).send(defaultRes.successFalse(200, resMessage.SELECT_CONTENT_FAILED));
        }
        else{
            res.status(200).send(defaultRes.successTrue(200, resMessage.SELECT_CONTENT_SUCCESS, [getSimilarQueryResult]));
        }
    }
    if(type == 2){
        const getLocationQuery = 'select Profile, NickName, YEAR(now())-Year(Birth)+1 as Age, Location from User where Location = ? and not UserId = ?';
        const getLocationQueryResult = await db.queryParam_Arr(getLocationQuery, [location, userid]);
    
        if(!getLocationQueryResult){
            res.status(200).send(defaultRes.successFalse(200, resMessage.SELECT_CONTENT_FAILED));
        }
        else{
            res.status(200).send(defaultRes.successTrue(200, resMessage.SELECT_CONTENT_SUCCESS, [getLocationQueryResult]));
        }

    }
    if(type == 3){
    
        const getMBTIQuery = 'select Profile, NickName, YEAR(now())-Year(Birth)+1 as Age, MBTI from User where MBTI = ? and not UserId = ?';
        const getMBTIQueryResult = await db.queryParam_Arr(getMBTIQuery, [MBTI, userid]);
    
        if(!getMBTIQueryResult){
            res.status(200).send(defaultRes.successFalse(200, resMessage.SELECT_CONTENT_FAILED));
        }
        else{
            res.status(200).send(defaultRes.successTrue(200, resMessage.SELECT_CONTENT_SUCCESS, [getMBTIQueryResult]));
        }

    }
    

});



module.exports = router;

