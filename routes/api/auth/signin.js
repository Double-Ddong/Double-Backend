var express = require('express');
var router = express.Router();

const crypto = require('crypto-promise');

const defaultRes = require('../../../module/utils/utils');
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage')
const db = require('../../../module/pool');

const jwtUtils = require('../../../module/jwt');

/* 로그인 api */
router.post('/', async (req, res) => {
    const email = req.body.Email;
    const password = req.body.Password;

    const selectUserQuery = 'SELECT Password, Salt FROM User WHERE Email = ?'
    const selectUserResult = await db.queryParam_Parse(selectUserQuery, email);

    if(selectUserResult[0]) {
        const salt = selectUserResult[0]['Salt'];
        const dbpw = selectUserResult[0]['Password'];
        
        const hashedPw = await crypto.pbkdf2(password, salt, 1000, 32, 'SHA512');

        if(hashedPw.toString('base64') == dbpw) { // 로그인 성공
            //토큰 발행
            const tokens = jwtUtils.sign(selectUserResult[0]);
            const accessToken = tokens.token;
            const refreshToken = tokens.refreshToken;
            const TokenUpdateQuery = "UPDATE User SET accessToken = ?, refreshToken = ? WHERE Email= ?";
            const TokenUpdateResult = await db.queryParam_Parse(TokenUpdateQuery, [accessToken, refreshToken, email]);
            const GetIdQuery = "select UserId from User WHERE email= ?";
            const GetIdQueryResult = await db.queryParam_Parse(GetIdQuery, [email]);
            var userid = GetIdQueryResult[0].UserId
            if (!TokenUpdateResult) {
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, "refreshtoken DB등록 오류 "));
            } else {
                res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SIGNIN_SUCCESS, {tokens, userid}));
            }

        } else { // 비밀번호 불일치
            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.NOT_CORRECT_USERINFO));
        }

    } else {
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.EMAIL_NOT_FOUND));
    }
});

module.exports = router;