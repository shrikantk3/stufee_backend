const express = require('express');
const app = express();
const teacherRouter = express.Router();
const connection = require('../www/config');
const resultAPI = require('../controller/shared-controller');
const verifyToken = require('../controller/jwtauth')

teacherRouter.get('/',verifyToken, (req, res)=>{
    connection.query('select * from teacher_log', (err, row, feild)=>{
     if(err){ res.send(err)}else{
         res.send(row);
     }
    })
 }).get('/:id',verifyToken, (req, res)=>{
    connection.query(`select * from teacher_log where uid = '${req.params.id}'`, (err, row, feild)=>{
     if(err){ res.send(err)}else{
         res.send(row);
     }
    })
 }).get('/byschool/:id',verifyToken, (req, res)=>{
    connection.query(`select * from teacher_log where school_id = '${req.params.id}'`, (err, row, feild)=>{
     if(err){ res.send(err)}else{
         res.send(row);
     }
    })
 }).post('/',verifyToken, (req, res)=>{

    if(req.body){
        let data = req.body;
        let date = new Date();
        data.id = `${date.getDay()}${date.getMonth()}${date.getSeconds()}${date.getMinutes()}`;
        let strQuery = `INSERT INTO teacher_log (id, uid, fname, mname, lname, phone, email, department, role, address1, address2, city, country, doj, created_on, created_by, modify_on, modify_by, active, persona, state) VALUES (
         '${data.id}', '${data.uid}', '${data.fname}', '${data.mname}', '${data.lname}', '${data.phone}', 
         '${data.email}', '${data.department}', '${data.role}', '${data.address1}', '${data.address2}', '${data.city}',
          '${data.country}', '${data.doj}', sysdate(), 'admin', 'sysdate()', 'admin', '1', '1', '${data.state}')`;
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
 .put('/',verifyToken, (req, res)=>{
   if(req.body){
    let data = req.body;
    let strQuery = `UPDATE teacher_log SET fname='${data.fname}', mname='${data.mname}', lname='${data.lname}', phone='${data.phone}', email='${data.email}', department='${data.department}', role='${data.role}', address1='${data.address1}', address2='${data.address2}', city='${data.city}', country='${data.country}', modify_on=sysdate(), modify_by='${data.uid}',profile_pic='${data.profile_pic}', state='${data.state}', active=${data.active}, persona=${data.persona} where id='${data.id}'`;
    connection.query(strQuery, (err, rows, feilds)=>{
       if (err) throw err
       else {
           res.send(resultAPI(err, rows, feilds, 'Succefully Submited!'));
       }
     });
   }else{
    res.send(resultAPI(null, null, null, 'Something went wrong!'));
   }

 })
 .delete('/:id',verifyToken, (req, res)=>{
     res.send('Candidaterouter DELETE Reposnse of Router');
 })
 

module.exports = teacherRouter;