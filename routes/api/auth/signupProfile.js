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
/* jwt 토큰 모듈 */
const jwtUtils = require('../../../module/jwt');

/* 회원가입 api */
router.post('/', async (req, res) => {
    const email = req.body.Email;
    const password = req.body.Password;
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
    
    const signupQuery = 'INSERT INTO User (Email, Password, NickName, Sex, Phone, Birth, Department, MBTI, Location, Height, Drink, Smoke, Hobby, Introduce, Salt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
    
    const selectUserQuery = 'SELECT UserId FROM User WHERE Email = ?'
    const selectUserResult = await db.queryParam_Parse(selectUserQuery, email);

    // email 중복 없을 시, 회원가입하기
    if (selectUserResult[0] == null) {
        // 비밀번호 암호화 작업
        const buf = await crypto.randomBytes(64);
        const salt = buf.toString('base64');
        const hashedPw = await crypto.pbkdf2(password, salt, 1000, 32, 'SHA512');

        // 암호화된 비밀번호와 함께 INSERT 문 실행
        const signupResult = await db.queryParam_Arr(signupQuery, [email, hashedPw.toString('base64'), nickname, sex, phone, birth, department, mbti, location, height, drink, smoke, hobby, introduce, salt]);
        
        // 결과값에 따른 쿼리문 출력하기
        if (!signupResult) {
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.SIGNUP_FAIL));
        } else { // 회원가입 성공
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SIGNUP_SUCCESS));
        }
    } else { // 중복되는 email 존재시, 회원가입 불가
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.DUPLICATED_ID_FAIL));
    }

});

module.exports = router;

