const express = require('express');
const app = express();
const AttendanceRouter = express.Router();
const connection = require('../www/config');
const verifyToken = require('../controller/jwtauth');
const resultAPI = require('../controller/shared-controller')


AttendanceRouter.get('/',verifyToken ,(req, res)=>{
    connection.query('select * from attendence_log',(err, rows, feild)=>{
        if(err){
            res.send(resultAPI(err,rows,feild, 'Error in leave management.'))
        }else{
            res.send(resultAPI(err,rows, feild,'Leave Data load successful.'));
        }
    })
})
.get('/byschool/:school_id',verifyToken,(req, res)=>{
    connection.query(`select * from attendence_log where school_id='${req.params.school_id}'`, (err, rows, feilds)=>{
        if (err) {res.send(resultAPI(err, rows, feilds, 'Error in LMS.'))}
        else{
            res.send(resultAPI(err,rows, feilds, 'Leave management load Successful.'))
        }
    })
})
.get('/byschool/:school_id/:fin_year',verifyToken,(req, res)=>{
    connection.query(`select * from attendence_log where school_id='${req.params.school_id}' and fin_year='${req.params.fin_year}'`, (err, rows, feilds)=>{
        if (err) {res.send(resultAPI(err, rows, feilds, 'Error in LMS.'))}
        else{
            res.send(resultAPI(err,rows, feilds, 'Leave management load Successful.'))
        }
    })
})
.post('/',verifyToken,(req, res)=>{
    if(req.body){
        let data = req.body;
        let strQuery = `Insert INTO attendence_log (id,student_id,class_id, section_id, fin_year, school_id, date, attd_type, created_by, created_on, modify_on, modify_by) VALUES`;
        if(data.student_id.length){
            let count = 0;
            let date = new Date();
            let id =parseInt(`${date.getDay()}${date.getMonth()}${date.getSeconds()}${date.getMinutes()}`);
            data.student_id.map(e=>{
                id = id+count;
                data.id = id;
                strQuery+=`${count>0?', ':''}(${data.id},'${e}', '${data.class_id}','${data.section_id}','${data.fin_year}', '${data.school_id}', '${data.date}', '${data.attd_type}','${data.created_by?data.created_by:'admin'}', sysdate(),sysdate(), '${data.modify_by?data.modify_by:'admin'}')`;
                count++;
            })
        }
        connection.query(strQuery,(err,rows, feilds )=>{
            if (err) {res.send(resultAPI(err, rows, feilds, 'Create Error in LMS.'))}
            else{
                res.send(resultAPI(err,rows, feilds, 'Leave management create Successful.'))
            }
        })
    }
}).post('/byclass',verifyToken,(req, res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    if(req.body){
        let data = req.body;
        let strQuery = `select attd.*, std.* from attendence_log attd INNER JOIN student_log std where std.id=attd.student_id and  attd.school_id='${data.school_id}' and attd.fin_year = '${data.fin_year}' and attd.class_id='${data.class_id}' and attd.section_id='${data.section_id}'`;
        connection.query(strQuery,(err,rows, feilds )=>{
            if (err) {res.send(resultAPI(err, rows, feilds, 'Create Error in LMS.'))}
            else{
                res.send(resultAPI(err,rows, feilds, 'Leave management create Successful.'))
            }
        })
    }else{
        res.send('Attendance data not found.')
    }
})
.put('/',verifyToken,(req, res)=>{
    if(req.body){
        let data = req.body;
        let strQuery = `UPDATE attendence_log SET attd_type='${data.approved}', modify_by='${data.modify_by}', modify_on='${data.modify_on}' where id='${data.id}' and school_id='${data.school_id}'`;        
        connection.query(strQuery,(err,rows, feilds )=>{
            if (err) {res.send(resultAPI(err, rows, feilds, 'Update Error in LMS.'))}
            else{
                res.send(resultAPI(err,rows, feilds, 'Leave management Update Successful.'))
            }
        })
    }
}).delete('/:id/school_id',verifyToken, (req, res)=>{    
    let strQuery = `Delete from attendence_log where id='${req.params.id}' and school_id='${req.params.school_id}'`;
    connection.query(strQuery, (err, rows, feilds)=>{
        if (err) {res.send(resultAPI(err, rows, feilds, 'Error in delete in LMS.'))}
        else{
            res.send(resultAPI(err,rows, feilds, 'Leave management deleted Successful.'))
        }
    })
})

module.exports = AttendanceRouter;