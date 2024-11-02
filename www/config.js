const mysql = require('mysql2');

const conn = mysql.createConnection({
    host:'',
    database:'',
    user:'',
    password:'',
    port:24543
});

module.exports  = conn;
