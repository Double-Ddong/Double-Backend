var express = require('express');
var router = express.Router();

const defaultRes = require('../../../module/utils/utils');
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage')
const db = require('../../../module/pool');

router.get('/:UserId/:Univ/:Know', async (req, res) => {
    const userid = req.params.UserId;
    const univscope = req.params.Univ;
    const knowscope = req.params.Know;

    const updateprofileQuery = 'UPDATE User SET ScopeUniversity = ?, ScopePeople = ? WHERE UserID = ?'
    const selectUserQuery = 'SELECT NickName FROM User WHERE UserId = ?'
    const selectUserResult = await db.queryParam_Parse(selectUserQuery, userid);
    
    if (!selectUserResult[0]) { // UserId에 해당하는 User가 없을 경우
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.USER_SELECTED_FAIL));
    } else { 
        //프로필 update 쿼리 실행하기
        const updateprofileResult = await db.queryParam_Arr(updateprofileQuery, [univscope, knowscope, userid]);
        
        //결과값에 따른 쿼리문 출력하기
        if (updateprofileResult[0]) {
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.MODIFY_PROFILE_FAILED));
        } else { // 프로필 수정 완료
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.MODIFY_PROFILE_SUCCESS));
        }
    }

});

module.exports = router;