const mysql = require('mysql2');

const conn = mysql.createConnection({
    host:'myschooldb.cyreei2g01sh.us-east-1.rds.amazonaws.com',
    database:'myschooldb',
    user:'admin',
    password:'Shri#123!',
    port:3306,
    connectTimeout: 20000 
});

module.exports  = conn;
