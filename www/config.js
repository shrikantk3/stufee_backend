const mysql = require('mysql');
conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'admin',
    database:'tutor'
});

module.exports  = conn;