var express = require('express');
var router = express.Router();

const defaultRes = require('../../../module/utils/utils');
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage')
const db = require('../../../module/pool');
const crypto = require('crypto-promise');

router.post('/:UserId', async (req, res) => {
    const userid = req.params.UserId;
    const curpw = req.body.CurPW;
    const newpw = req.body.NewPW;

    const selectUserQuery = 'SELECT Password, Salt FROM User WHERE UserId = ?'
    const selectUserResult = await db.queryParam_Parse(selectUserQuery, userid);

    if(selectUserResult[0]) {
        const salt = selectUserResult[0]['Salt'];
        const dbpw = selectUserResult[0]['Password'];
        
        const hashedPw = await crypto.pbkdf2(curpw, salt, 1000, 32, 'SHA512');

        if(hashedPw.toString('base64') == dbpw) { // 비밀번호 일치
            const buf = await crypto.randomBytes(64);
            const newsalt = buf.toString('base64');
            const newhashedPw = await crypto.pbkdf2(newpw, newsalt, 1000, 32, 'SHA512');
            const changeQuery = 'UPDATE User SET Password = ?, Salt = ? WHERE UserId= ?';
            const changeResult = await db.queryParam_Arr(changeQuery, [newhashedPw.toString('base64'), newsalt, userid]);

            if(changeResult[0]){
                res.status(200).send(defaultRes.successTrue(200, "비밀번호 변경 실패"));
            }
            else{
                res.status(200).send(defaultRes.successTrue(200, "비밀번호 변경 완료"));
            }

        } else { // 비밀번호 불일치
            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.NOT_CORRECT_USERINFO));
        }

    } else {
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.EMAIL_NOT_FOUND));
    }
});

module.exports = router;