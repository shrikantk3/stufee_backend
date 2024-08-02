const mysql = require('mysql');
conn = mysql.createConnection({
    host:'000webhost.com',
    user:'id22073986_admin',
    password:'Shri@123!',
    database:'id22073986_webguru',
});

module.exports  = conn;