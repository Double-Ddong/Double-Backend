const mysql = require("promise-mysql");

const dbConfig = {
  host: "doubleddong.c1vz7qc5hr9x.ap-northeast-2.rds.amazonaws.com",
  port: 3306,
  user: "admin",
  password: "admin54321",
  database: "DoubleDDong"
};

module.exports = mysql.createPool(dbConfig);