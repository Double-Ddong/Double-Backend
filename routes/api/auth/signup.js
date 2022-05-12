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
router.post('/', async (req, res) => {
    const email = req.body.Email;
    const password = req.body.Password;
    
    const signupQuery = 'INSERT INTO User (Email, Password, Salt) VALUES (?,?,?)'
    
    const selectUserQuery = 'SELECT UserId FROM User WHERE Email = ?'
    const selectUserResult = await db.queryParam_Parse(selectUserQuery, email);

    // email 중복 없을 시, 회원가입하기
    if (selectUserResult[0] == null) {
        // 비밀번호 암호화 작업
        const buf = await crypto.randomBytes(64);
        const salt = buf.toString('base64');
        const hashedPw = await crypto.pbkdf2(password, salt, 1000, 32, 'SHA512');

        // 암호화된 비밀번호와 함께 INSERT 문 실행
        const signupResult = await db.queryParam_Arr(signupQuery, [email, hashedPw.toString('base64'), salt]);
        
        // 결과값에 따른 쿼리문 출력하기
        if (!signupResult) {
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.SIGNUP_FAIL));
        } else { // 회원가입 성공

            const selectUserIdQuery = 'SELECT UserId FROM User where Email = ?';
            const selectUserIdQueryResult = await db.queryParam_Parse(selectUserIdQuery, email);
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SIGNUP_SUCCESS, selectUserIdQueryResult[0].UserId));
        }
    } else { // 중복되는 email 존재시, 회원가입 불가
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.DUPLICATED_ID_FAIL));
    }

});

module.exports = router;

