const db = require('../../../module/pool');
const defaultRes = require('../../../module/utils/utils');
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage')
const crypto = require('crypto-promise');
var express = require('express');
var router = express.Router();

const messageSend = require('./sendMessage');
const randomNum = require('./randomNum');

router.post('/', async (req, res) => { 
    // 1. 입력받은 휴대폰번호를 가진 user가 있는지 확인
    var phone = req.body.Phone;
    // 입력받은 휴대폰 번호를 가진 user가 존재하는지 확인
    const selectQuery = 'SELECT * FROM User WHERE Phone = ?'
    const selectResult = await db.queryParam_Parse(selectQuery, [phone]);
    
    if (selectResult[0] == null) {
        res.status(200).send(defaultRes.successFalse(statusCode.OK, "입력된 번호에 대한 아이디가 없습니다."));
    } else {
        // 3. 인증번호 코드 만들기
        // 4. 문자서비스 API 이용해서 문자 전송하기 
        var sendNum = randomNum.authNo(0,9,6);
        messageSend.send_message(phone, sendNum);
       res.status(200).send(defaultRes.successTrue(200, "인증번호 전송 완료", sendNum));
    }
});

router.get('/getID', async (req, res) => {
    var phone = req.body.Phone;
    const getIDQuery = 'SELECT Email FROM User WHERE Phone= ?';
    const getIDQueryResult = await db.queryParam_Arr(getIDQuery, phone);
    if(!getIDQueryResult){
        res.status(200).send(defaultRes.successTrue(200, "저장된 핸드폰번호 오류"));
    }
    else{
        res.status(200).send(defaultRes.successTrue(200, "아이디 찾기 성공", getIDQueryResult));
    }
    
});

module.exports = router;

/*비밀번호 찾기 
1. 이메일, 휴대폰 번호 입력
    - 입력받은 이메일을 가진 사람이 있는지 확인
2. DB에 있는 휴대폰 번호와 입력한 휴대폰 번호가 동일한지 확인
3. 동일하다면 랜덤 6자리 숫자를 휴대폰 번호로 전송한다.

4. 임시비밀번호 발급 :  이메일에 랜덤문자열을 보낸다. (인증이 되었을 경우)
5. 임시비번으로, 비밀번호 업데이트
    - 암호화 진행 한뒤 업데이트
*/
