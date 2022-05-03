const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
// aws.config.loadFromPath( __dirname + '\\..\\config\\s3Config.json');
aws.config.loadFromPath('C:\\Users\\98092\\OneDrive\\Desktop\\Ddong-backend\\config\\s3Config.json');
// __dirname
// __dirname + '/../config/s3Config.json'
console.log(__dirname + '\\..\\config\\s3Config.json')

const s3 = new aws.S3();
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'doubleddong',
        acl: 'public-read',
        key: function(req, file, cb){
                cb(null, Date.now() + '.' + file.originalname.split('.').pop()); // 이름 설정
        }
    })
},'NONE');

module.exports = upload;