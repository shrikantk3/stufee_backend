const mysql = require('mysql');
conn = mysql.createConnection({
    host:'mysql-1534af81-abhash-1b57.g.aivencloud.com',
    database:'defaultdb',
    user:'avnadmin',
    password:'AVNS_1neP3haGeRygTbF3C0g',
    port:24543
});

module.exports  = conn;
