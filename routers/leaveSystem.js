const express = require('express');
const app = express();
const LmsRouter = express.Router();
const connection = require('../www/config');
const verifyToken = require('../controller/jwtauth');
const resultAPI = require('../controller/shared-controller')


LmsRouter.get('/',verifyToken ,(req, res)=>{
    connection.query('select * from leave_log',(err, rows, feild)=>{
        if(err){
            res.send(resultAPI(err,rows,feild, 'Error in leave management.'));
        }else{
            res.send(resultAPI(err,rows, feild,'Leave Data load successful.'));
        }
    })
})
.get('/byschool/:school_id',verifyToken,(req, res)=>{
    connection.query(`select * from leave_log where school_id='${req.params.school_id}'`, (err, rows, feilds)=>{
        if (err) {res.send(resultAPI(err, rows, feilds, 'Error in LMS.'))}
        else{
            res.send(resultAPI(err,rows, feilds, 'Leave management load Successful.'))
        }
    })
})
.get('/byschool/:uid/:school_id/:fin_year',verifyToken,(req, res)=>{
    strQuery = `select * from leave_log where school_id='${req.params.school_id}' and fin_year='${req.params.fin_year}' and uid='${req.params.uid}'`;
    connection.query(strQuery, (err, rows, feilds)=>{
        if (err) {res.send(resultAPI(err, rows, feilds, 'Error in LMS.'))}
        else{
            res.send(resultAPI(err,rows, feilds, 'Leave management load Successful.'))
        }
    })
})
.get('/byteacher/:school_id/:fin_year',verifyToken,(req, res)=>{
    strQuery = `select lg.*, u.username as name, u.email as email, u.type as user_type from leave_log lg INNER JOIN users_log u on u.uid = lg.uid where lg.school_id='${req.params.school_id}' and lg.fin_year='${req.params.fin_year}'`;
    connection.query(strQuery, (err, rows, feilds)=>{
        if (err) {res.send(resultAPI(err, rows, feilds, 'Error in LMS.'))}
        else{
            res.send(resultAPI(err,rows, feilds, 'Leave management load Successful.'))
        }
    })
})
.post('/',verifyToken,(req, res)=>{
    if(req.body){
        let data = req.body;
        let date = new Date();
        data.id = `${date.getDay()}${date.getMonth()}${date.getSeconds()}${date.getMinutes()}`;
        let strQuery = `Insert INTO leave_log (id, attd_type, leave_start, leave_end, approved, uid,fin_year,school_id,created_on, created_by, modify_on, modify_by,comment, reason) VALUES (${data.id},${data.attd_type},'${data.leave_start}','${data.leave_end}','${data.approved}','${data.uid}','${data.fin_year}','${data.school_id}',sysdate(),'${data.created_by}',sysdate(),'${data.modify_by}','${data.comment}', '${data.reason}')`; 
        connection.query(strQuery,(err,rows, feilds )=>{
            if (err) {res.send(resultAPI(err, rows, feilds, 'Create Error in LMS.'))}
            else{
                res.send(resultAPI(err,rows, feilds, 'Leave management create Successful.'))
            }
        })
    }
})
.put('/',verifyToken,(req, res)=>{
    if(req.body){
        let data = req.body;
        let strQuery = `UPDATE leave_log SET approved='${data.approved}', modify_by='${data.modify_by}', modify_on=sysdate() where student_id='${data.student_id}' and school_id='${data.school_id}'`
        console.log(strQuery);        
        connection.query(strQuery,(err,rows, feilds )=>{
            if (err) {res.send(resultAPI(err, rows, feilds, 'Update Error in LMS.'))}
            else{
                res.send(resultAPI(err,rows, feilds, 'Leave management Update Successful.'))
            }
        })
    }
}).delete('/:id/school_id',verifyToken, (req, res)=>{    
    let strQuery = `Delete from leave_log where id='${req.params.id}' and school_id='${req.params.school_id}'`;
    connection.query(strQuery, (err, rows, feilds)=>{
        if (err) {res.send(resultAPI(err, rows, feilds, 'Error in delete in LMS.'))}
        else{
            res.send(resultAPI(err,rows, feilds, 'Leave management deleted Successful.'))
        }
    })
})

module.exports = LmsRouter;