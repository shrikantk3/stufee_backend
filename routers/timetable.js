const express = require('express');
const app = express();
const timetableRouter = express.Router();
const connection = require('../www/config');
const resultAPI = require('../controller/shared-controller');
const verifyToken = require('../controller/jwtauth')

timetableRouter.get('/',verifyToken, (req, res)=>{
    connection.query('select * from timetable_log', (err, row, feild)=>{
     if(err){  res.send(resultAPI(err, row, feild, 'Error!'));}
     else{
         res.send(resultAPI(err, row, feild, 'Succefully loaded!'));
     }
    })
 }).get('/:id',verifyToken, (req, res)=>{
    connection.query(`select * from timetable_log where id = "${req.params.id}"`, (err, row, feild)=>{
     if(err){ res.send(resultAPI(err, row, feild, 'Error!'));}else{
        res.send(resultAPI(err, row, feild, 'Succefully loaded!'));
     }
    })
 }).get('/byschool/:id',verifyToken, (req, res)=>{
    if(req.params.id){
        connection.query(`select sb.*, cl.name as class_name from timetable_log sb INNER JOIN class_log cl where cl.id=sb.class_id and sb.school_id = '${req.params.id}'`, (err, row, feild)=>{
            if(err){  res.send(resultAPI(err, row, feild, 'Error!'));}
            else{
               res.send(resultAPI(err, row, feild, 'Succefully loaded!'));
            }
           })
    }else{
        res.send({results:null, error:true, message:'Invalid Id. Please try again!'})
    }
 }).get('/byschool/:id/:class_id',verifyToken, (req, res)=>{
    if(req.params.id){
        connection.query(`
select tm.*, cl.name as class_name, sj.name as subject_name, sc.name as section_name,  CONCAT(tch.fname,' ',tch.mname,' ',tch.lname) as teacher_name from timetable_log tm 
	INNER JOIN class_log cl on tm.class_id = cl.id
    Inner Join section_log sc on tm.section_id = sc.id
    inner join teacher_log tch on tm.teacher_id = tch.id
    INNER Join subject_log sj on sj.id = tm.subject_id
    where tm.school_id='${req.params.id}' and tm.class_id='${req.params.class_id}'

            `, (err, row, feild)=>{
            if(err){  res.send(resultAPI(err, row, feild, 'Error!'));}
            else{
               res.send(resultAPI(err, row, feild, 'Succefully loaded!'));
            }
           })
    }else{
        res.send({results:null, error:true, message:'Invalid Id. Please try again!'})
    }
 }).post('/',verifyToken, (req, res)=>{
    console.log(req.body);
    if(req.body){
        let data = req.body;
        let date = new Date();
        let count=0;   
        let id = `${date.getDay()}${date.getMonth()}${date.getSeconds()}${date.getMinutes()}`;
        let strQuery = `INSERT INTO timetable_log (id,school_id,class_id,section_id,fin_year,day,start_time, end_time,teacher_id,subject_id, created_by, created_on, modify_on, modify_by) VALUES `;
        if(data.section_id){
            data.section_id.map(section=>{
                id = id+count;
                data.id = id;
                strQuery+=`${count>0?', ':''}(${data.id},'${data.school_id}','${data.class_id}','${section}','${data.fin_year}','${data.day}','${data.start_time}','${data.end_time}','${data.teacher_id}','${data.subject_id}','${data.created_by?data.created_by:'admin'}', sysdate(), sysdate(),'${data.modify_by?data.modify_by:'admin'}')`;
                count++;
            });
        }
          connection.query(strQuery, (err, rows, feilds)=>{
            if (err) {
                res.send(resultAPI(err, rows, feilds, 'Invalid Entry!'));
            }
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
        let strtSQl = `UPDATE timetable_log SET start_time='${data.start_time}', end_time='${data.end_time}', teacher_id='${data.teacher_id}' where school_id='${data.school_id}' and class_id='${data.class_id}' and section_id='${data.section_id}'`;
        connection.query(strQuery, (err, rows, feilds)=>{
            if (err) {
                res.send(resultAPI(err, rows, feilds, 'Invalid Entry!'));
            }
            else {
                res.send(resultAPI(err, rows, feilds, 'Succefully Updated!'));
            }
          })
    }else{
        res.send(resultAPI(null, null, null, 'Something went wrong!'));
    }
 })
 .delete('/:id',verifyToken, (req, res)=>{
    if(req.params.id){
       let strtSQl = `DELETE from timetable_log where id='${req.params.id}'`;
        connection.query(strQuery, (err, rows, feilds)=>{
            if (err) {
                res.send(resultAPI(err, rows, feilds, 'Invalid Entry!'));
            }
            else {
                res.send(resultAPI(err, rows, feilds, 'Deleted.'));
            }
          })
    }else{
        res.send(resultAPI(null, null, null, 'Something went wrong!'));
    }
 })
 

module.exports = timetableRouter;

