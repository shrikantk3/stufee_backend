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
    req.params.id = 'TRJB1906';
    res.setHeader('Access-Control-Allow-Origin', '*');
      if (req.params.id) {
        connection.query(`select * from users_log where uid="${req.params.id}"`, (err, row, feild) => {
          res.send(APIresult(err, row, feild, 'List execution successful!'));
        })
      }
    
  })
  .post('/register', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.body) {
      let data = req.body;
      connection.query('select max(uid) as maxId from users_log', (err, rows, result)=>{
        console.log('MAX Id :', (rows[0].maxId +1));
      
        connection.query(`INSERT INTO users_log(uid,username,phone,type,createdon,created_by,modify_on,modify_by,email)VALUES('${data.id}','${data.name}',${data.phone},'${data.type}',sysdate(),'admin',sysdate(),'admin','${data.email}')`, (err, row, feild) => {
          res.send(APIresult(err,row, feild, 'List execution successful!'));
        })
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
    console.log('User  login:', req.body)
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.body) {
      let data = req.body;
      connection.query(`SELECT * from users_log where username ='${data.username}'`, (err, row, feild) => {
        if(row[0].uid){
           let strSQL = `SELECT * from ${row[0].type=='tutor'?'tutor_log':'candidate_log'} where phone=${row[0].phone}`;
          connection.query(strSQL, (error, rows, feilds)=>{
            res.send(APIresult(error,rows, feilds, 'List execution successful!'));
          })
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
    res.end('Auth DELETE Reposnse of Router');
  })

module.exports = Authrouter;
