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
// upload.single('img'),
/* 회원가입 api */
router.post('/', upload.single('img'), async (req, res) => {

    // userid = req.params.UserId 
    console.log(req.file.location)
    const updateprofileQuery = 'UPDATE User SET Profile = ? WHERE UserID = 12'
    
    // const selectUserQuery = 'SELECT * FROM User WHERE UserId = ?'
    // const selectUserResult = await db.queryParam_Parse(selectUserQuery, userid);
    
    // if (!selectUserResult) { // UserId에 해당하는 User가 없을 경우
    //     res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.USER_SELECTED_FAIL));
    // } else { 
        // 프로필 update 쿼리 실행하기
        const updateprofileResult = await db.queryParam_Arr(updateprofileQuery, [req.body.imgname]);
        
        // 결과값에 따른 쿼리문 출력하기
        if (!updateprofileResult) {
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.SIGNUP_FAIL));
        } else { // 프로필 입력 완료
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SIGNUP_SUCCESS));
        }
    // }

});

module.exports = router;

