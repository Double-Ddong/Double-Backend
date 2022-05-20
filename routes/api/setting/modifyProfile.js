var express = require('express');
var router = express.Router();

const defaultRes = require('../../../module/utils/utils');
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage')
const db = require('../../../module/pool');

const upload = require('../../../module/multer.js')

router.post('/:UserId', upload.single('img'), async (req, res) => {
    const userid = req.params.UserId;
    const nickname = req.body.NickName;
    const birth = req.body.Birth;
    const department = req.body.Department;
    const mbti = req.body.MBTI;
    const location = req.body.Location;
    const height = req.body.Height;
    const drink = req.body.Drink;
    const smoke = req.body.Smoke;
    const hobby = req.body.Hobby;
    const introduce = req.body.Introduce;

    const updateprofileQuery = 'UPDATE User SET Profile = ?, NickName = ?, Birth = ?, Department = ?, MBTI = ?, Location = ?, Height = ?, Drink = ?, Smoke = ?, Hobby = ?, Introduce = ? WHERE UserID = ?'
    const selectUserQuery = 'SELECT NickName FROM User WHERE UserId = ?'
    const selectUserResult = await db.queryParam_Parse(selectUserQuery, userid);

    
    if (!selectUserResult[0]) { // UserId에 해당하는 User가 없을 경우
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.USER_SELECTED_FAIL));
    } else { 

        //프로필 update 쿼리 실행하기
        const updateprofileResult = await db.queryParam_Arr(updateprofileQuery, [req.file.location, nickname, birth, department, mbti, location, height, drink, smoke, hobby, introduce, userid]);
        
        //결과값에 따른 쿼리문 출력하기
        if (updateprofileResult[0]) {
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.MODIFY_PROFILE_FAILED));
        } else { // 프로필 수정 완료
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.MODIFY_PROFILE_SUCCESS, req.file.location));
        }
    }
});

module.exports = router;