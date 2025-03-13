const express = require('express');
const multer = require('multer')
const app = express();
const Authrouter = express.Router();
const connection = require('../www/config');
const APIresult = require('../controller/shared-controller');
const path = require('path');
const jwt = require('jsonwebtoken');



Authrouter.get('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
  connection.query('select * from users_log', (err, row, feild) => {
    res.send(APIresult(err, row, feild, 'List execution successful!'));
  })
  }).get('/:id', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
      if (req.params.id) {
        connection.query(`select * from users_log where uid='${req.params.id}'`, (err, row, feild) => {
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
        connection.query(strquery, (err, row, feild) => {
          if(err){
            throw err;
          }
          else{
            id = row.results?row.results[0].uid:'345543';
            let token = jwt.sign({id:id}, 'gfg_jwt_secret_key');
            res.send({results:row, udata:data, message:'Successfully Created', valid:true, token:token});
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
          id = row.results?row.results[0].uid:'345543';
          let token = jwt.sign({id:id}, 'gfg_jwt_secret_key');
          res.send(APIresult(err, row, feild, token));
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
  .post('/create', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.body) {
      let data = req.body;
      let date = new Date();
      data.uid = `${date.getDay()}${date.getMonth()}${date.getSeconds()}${date.getMinutes()}`;
      let strQuery=`INSERT INTO users_log (uid,username,password,token,type,active, created_by,createdon,modify_by,modify_on, email,phone) value 
('${data.uid}','${data.username}','${data.password}',null,'${data.type}',1,'admin',sysdate(),'admin',sysdate(),'${data.email}',${data.phone})`
      connection.query(strQuery, (err, row, feild) => {
        if(err){
          res.send({
            results: null,
            message: err.sqlMessage,
            valid: false,
            udata:null
          });
        }
        else{
          res.send({results:row, udata:data, message:'Successfully Created', valid:true});
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
  .post('/logout', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.body) {
      let data = req.body;
      connection.query(`UPDATE users_log SET token=null where uid='${data.uid}'`, (err, row, feild) => {
        if(err) throw err 
        else{
          res.send(APIresult(err, row, feild, 'Logout Successful!'))
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
  .post('/token', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.body) {
      let data = req.body;
      connection.query(`UPDATE users_log SET token='${data.token}' where uid='${data.uid}'`, (err, row, feild) => {
        if(err) throw err 
        else{
          res.send(APIresult(err, row, feild, 'Token insert Successfully!'))
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
  .post('/upload', (req, res, next)=>{
    upload(req, res, function (err) {
      if (err) {
          res.send(err);
      } else {
          // SUCCESS, image successfully uploaded
          res.send({
            message:'File Upload Succefully!',
            result: req.file
          });
      }
  });
  })
  .delete('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send('Auth DELETE Reposnse of Router');
  })



// UPLOAD START HERE -------------------------------------------
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      // Uploads is the Upload_folder_name
      cb(null, "assets/images");
  },
  filename: function (req, file, cb) {
      let uid =  req.body.uid?req.body.uid:'';
      let type =  req.body.type?req.body.type:'';
      cb(null, uid + "-" + type + "-" + Date.now() + ".jpg");
  },
});
const maxSize = 1 * 1000 * 1000;
var upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, cb) {
      // Set the filetypes, it is optional
      var filetypes = /jpeg|jpg|png/;
      var mimetype = filetypes.test(file.mimetype);

      var extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
  );

  if (mimetype && extname) {
      return cb(null, true);
  }

  cb(
      "Error: File upload only supports the " +
          "following filetypes - " +
          filetypes
  );
},

// mypic is the name of file attribute
}).single("photo");

// UPLOAD END HERE -------------------------------------


module.exports = Authrouter;
