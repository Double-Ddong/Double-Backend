const request = require('request');
var express = require('express');
var router = express.Router();

const crypto = require('crypto-promise');

const defaultRes = require('../../../module/utils/utils');
const statusCode = require('../../../module/utils/statusCode');
const resMessage = require('../../../module/utils/responseMessage')
const db = require('../../../module/pool');

const jwtUtils = require('../../../module/jwt');

const SERVICE_KEY = '8f5b2f3f38148c5a54849ecb417cc3b6';
const url = 'http://www.career.go.kr/cnet/openapi/getOpenApi'

router.get('/', function(req, res, next){
  const requestUrl_list = `${url}?apiKey=${SERVICE_KEY}&svcType=api&svcCode=SCHOOL&contentType=json&gubun=univ_list&region=100260&perPage=100`
  
  request(requestUrl_list, function(error, response, body){
    if(error){
      throw error
    }

    var obj = JSON.parse(body);
    var content = obj.dataSearch.content;
    var schoolList = [];

    for(var i in content){
      schoolList.push(content[i].schoolName);
    }

    res.status(200).send(defaultRes.successTrue(statusCode.OK, "대학교 목록", schoolList));

  })
 
});

router.get('/getMail/:School', function(req, res, next){
  var school = req.params.School;
  const requestUrl_mail = encodeURI(`${url}?apiKey=${SERVICE_KEY}&svcType=api&svcCode=SCHOOL&contentType=json&gubun=univ_list&region=100260&searchSchulNm=${school}`)

  request(requestUrl_mail, function(error, response, body){
    if(error){
      throw error
    }

    var obj = JSON.parse(body);
    var content = obj.dataSearch.content;
    var univLink = content[0].link;
    const univMail = univLink.split('.')[1];

    res.status(200).send(defaultRes.successTrue(statusCode.OK, "대학교 메일 주소", univMail));


  })
  
});

module.exports = router;


