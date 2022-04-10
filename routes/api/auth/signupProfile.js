var express = require('express');
var router = express.Router();

/*crypto : 암호화모듈 */
const crypto = require('crypto-promise');

/* 결과값 출력 모듈 세가지*/
const defaultRes = require('../../../module/utils/utils'); 
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage')
/* db 연결 모듈 */
const db = require('../../../module/pool');

/* 회원가입 api */
router.post('/:UserId', async (req, res) => {
    const userid = req.params.UserId;
    const nickname = req.body.NickName;
    const sex = req.body.Sex; // 0일경우 남자, 1일경우 여자
    const phone = req.body.Phone;
    const birth = req.body.Birth;
    const department = req.body.Department;
    const mbti = req.body.Mbti;
    const location = req.body.Location;
    const height = req.body.Height;
    const drink = req.body.Drink;
    const smoke = req.body.Smoke;
    const hobby = req.body.Hobby;
    const introduce = req.body.Introduce;
    
    const updateprofileQuery = 'UPDATE User SET NickName = ?, Sex = ?, Phone = ?, Birth = ?, Department = ?, MBTI = ?, Location = ?, Height = ?, Drink = ?, Smoke = ?, Hobby = ?, Introduce = ? WHERE UserID = ?'
    
    const selectUserQuery = 'SELECT * FROM User WHERE UserId = ?'
    const selectUserResult = await db.queryParam_Parse(selectUserQuery, userid);
    
    if (!selectUserResult) { // UserId에 해당하는 User가 없을 경우
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.USER_SELECTED_FAIL));
    } else { 
        // 프로필 update 쿼리 실행하기
        const updateprofileResult = await db.queryParam_Arr(updateprofileQuery, [nickname, sex, phone, birth, department, mbti, location, height, drink, smoke, hobby, introduce, userid]);
        
        // 결과값에 따른 쿼리문 출력하기
        if (!updateprofileResult) {
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.SIGNUP_FAIL));
        } else { // 프로필 입력 완료
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SIGNUP_SUCCESS));
        }
    }

});

module.exports = router;

