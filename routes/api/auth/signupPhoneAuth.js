var express = require('express');
var router = express.Router();
const defaultRes = require('../../../module/utils/utils');
const messageSend = require('./sendMessage');
const randomNum = require('./randomNum');
/* db 연결 모듈 */
const db = require('../../../module/pool');
router.post('/', async (req, res) => {
    var phone = req.body.Phone;
    var sendNum = randomNum.authNo(0,9,4);
    messageSend.send_message(phone, `[MEET] 인증번호\n${sendNum}를 입력해주세요.`);

    res.status(200).send(defaultRes.successTrue(200, "인증번호 전송 완료", sendNum));
});

router.post('/OK/:UserId', async (req, res) => {
    var UserId = req.params.UserId;
    var phone = req.body.Phone;

    const UpdateQuery = 'Update User SET Phone = ? where UserId = ?'
    const UpdateQueryResult = await db.queryParam_Parse(UpdateQuery,[phone,UserId])
    if(!UpdateQueryResult){
        res.status(200).send(defaultRes.successFalse(200, "휴대폰번호 데베 저장 실패"));

    }
    else{
        res.status(200).send(defaultRes.successTrue(200, "휴대폰번호 저장 성공"));
    }
    });


module.exports = router;

/*
회원가입 핸드폰 인증
1. 핸드폰 번호를 입력 받는다.
2. 핸드폰 번호로 랜덤 6자리 숫자 발송
3. 인증번호 프론트에게 전달
*/