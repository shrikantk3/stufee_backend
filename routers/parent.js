const express = require('express');
const app = express();
const teacherRouter = express.Router();
const connection = require('../www/config');
const resultAPI = require('../controller/shared-controller');

teacherRouter.get('/', (req, res)=>{
    connection.query('select * from parent_log', (err, row, feild)=>{
     if(err){ res.send(err)}else{
         res.send(resultAPI(err, row, feild, 'Succefully loaded!'));
     }
    })
 }).get('/:id', (req, res)=>{
    connection.query(`select * from parent_log where id = "${req.params.id}"`, (err, row, feild)=>{
     if(err){ res.send(err)}else{
        res.send(resultAPI(err, row, feild, 'Succefully loaded!'));
     }
    })
 }).post('/', (req, res)=>{
    if(req.body){
        let data = req.body;
        let date = new Date();
        data.id = `${date.getDay()}${date.getMonth()}${date.getSeconds()}${date.getMinutes()}`;
        let strQuery = `INSERT INTO parent_log (id, uid, fname, lname, email, phone, student_id, gender, 
        created_by, created_on, modify_on, modify_by) VALUES (
        '${data.id}', '${data.uid}', '${data.fname}', '${data.lname}', '${data.email}', '${data.phone}', '${data.school_id}',
         '${data.gender}', 'admin', sysdate(), sysdate(), 'admin')`;
          connection.query(strQuery, (err, rows, feilds)=>{
            if (err) throw err
            else {
                res.send(resultAPI(err, rows, feilds, 'Succefully Submited!'));
            }
          })
    }else{
        res.send(resultAPI(null, null, null, 'Something went wrong!'));
    }
 })
 .put('/', (req, res)=>{
     res.send('Candidaterouter PUT Reposnse of Router');
 })
 .delete('/:id', (req, res)=>{
     res.send('Candidaterouter DELETE Reposnse of Router');
 })
 

module.exports = teacherRouter;

