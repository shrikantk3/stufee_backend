const express = require('express');
const app = express();
const teacherRouter = express.Router();
const connection = require('../www/config');
const resultAPI = require('../controller/shared-controller');

teacherRouter.get('/', (req, res)=>{
    connection.query('select * from teacher_log', (err, row, feild)=>{
     if(err){ res.send(err)}else{
         res.send(row);
     }
    })
 }).get('/:id', (req, res)=>{
    connection.query(`select * from teacher_log where uid = "${req.params.id}"`, (err, row, feild)=>{
     if(err){ res.send(err)}else{
         res.send(row);
     }
    })
 }).post('/', (req, res)=>{

    if(req.body){
        let data = req.body;
        let date = new Date();
        data.id = `${date.getDay()}${date.getMonth()}${date.getSeconds()}${date.getMinutes()}`;
        let strQuery = `INSERT INTO teacher_log (id, uid, fname, mname, lname, phone, email, department, role, adress1,
         address2, city, country, doj, created_on, created_by, modify_on, modify_by, active, persona) VALUES (
         '${data.id}', '${data.uid}', '${data.fname}', '${data.mname}', '${data.lname}', '${data.phone}', 
         '${data.email}', '${data.department}', '${data.role}', '${data.address1}', '${data.address2}', '${data.city}',
          '${data.country}', '${data.doj}', sysdate(), 'admin', 'sysdate()', 'admin', '1', '1')`;
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