const express = require('express');
const app = express();
const Authrouter = express.Router();
const connection = require('../www/config');
const APIresult = require('../controller/shared-controller');

Authrouter.get('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    connection.query('select * from users_log', (err, row, feild) => {
      res.send(APIresult(err, row, feild, 'List execution successful!'));
    })
  }).get('/:id', (req, res) => {
    console.log(req.params.id)
    res.setHeader('Access-Control-Allow-Origin', '*');
      if (req.params.id) {
        connection.query(`select * from users_log where uid="${req.params.id}"`, (err, row, feild) => {
          res.send(APIresult(err, row, feild, 'List execution successful!'));
        })
      }
    
  })
  .post('/register', (req, res) => {
    console.log('Data', req.body)
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.body) {
      let data = req.body;
        let date = new Date();
        data.uid = `${date.getDay()}${date.getMonth()}${date.getSeconds()}${date.getMinutes()}`;
        let strquery = `INSERT INTO users_log(uid,username,password, phone,type,createdon,created_by,modify_on,
        modify_by,email)VALUES('${data.uid}','${data.username}','${data.password}','${data.phone}','${data.type}',
        sysdate(),'admin',sysdate(),'admin','${data.email}')`;
        //INSERT INTO `defaultdb`.`users_log` (`uid`, `username`, `password`, `token`, `type`, `active`,
        // `created_by`, `createdon`, `modify_by`, `modify_on`, `email`, `phone`) VALUES 
        //('23211', 'syana', '1234', 'null', 'teacher', '1', 'admin', '2024-08-16', 'admin', 
        //'2024-08-16', 'syana@gmail.com', '0987122323');
        connection.query(strquery, (err, row, feild) => {
          if(err){
            console.log("############# err:", err)
            throw err;
          }
          else{
            console.log("########else :", err, row)
            res.send(row);
          }
        })
    
    } else {
      res.send({
        result: null,
        message: 'invalid input please try again',
        valid: false
      });
    }
  })
  .post('/login', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.body) {
      let data = req.body;
      connection.query(`SELECT * from users_log where username ='${data.username}' and password='${data.password}'`, (err, row, feild) => {
        if(err) throw err 
        else{
          res.send(APIresult(err, row, feild, 'Succefully logedin!'))
        }
      })
    } else {
      res.send({
        result: null,
        message: 'invalid input please try again',
        valid: false
      });
    }
  })
  .delete('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send('Auth DELETE Reposnse of Router');
  })

module.exports = Authrouter;
