const express = require('express');
const app = express();
const StufeeRouter = express.Router();
const connection = require('../www/config');
const resultAPI = require('../controller/shared-controller');
const verifyToken = require('../controller/jwtauth')

StufeeRouter.get('/',verifyToken, (req, res)=>{
    connection.query('select * from stufee_log', (err, row, feild)=>{
     if(err){ res.send(err)}else{
         res.send(resultAPI(err, row, feild, 'Succefully loaded!'));
     }
    })
 }).get('/:id',verifyToken, (req, res)=>{
    connection.query(`select * from stufee_log where id = '${req.params.id}'`, (err, row, feild)=>{
     if(err){ res.send(err)}else{
        res.send(resultAPI(err, row, feild, 'Succefully loaded!'));
     }
    })
 }).get('/byschool/:id',verifyToken, (req, res)=>{
    if(req.params.id){
        connection.query(`select * from stufee_log where school_id = '${req.params.id}'`, (err, row, feild)=>{
            if(err){ res.send(err)}else{
               res.send(resultAPI(err, row, feild, 'Succefully loaded!'));
            }
           })
    }else{
        res.send({results:null, error:true, message:'Invalid Id. Please try again!'})
    }
 }).post('/',verifyToken, (req, res)=>{
    if(req.body){
        let data = req.body;
        let date = new Date();        
        data.id = `${date.getDay()}${date.getMonth()}${date.getSeconds()}${date.getMinutes()}`;
        let strQuery = `INSERT INTO stufee_log (id, uid,student_name ,created_on, created_by, month, year, finance_year, 
        school_id, amount, paid, modify_on, modify_by, fee_due_date, fee_structure_id, fee_pay_mode, due_date, 
        fee_details, pay_mode) VALUES (${data.id}, '${data.uid}','${data.student_name}',sysdate(), 'admin','${data.month}','${data.year}',
         '${data.finance_year}','${data.school_id}','${data.amount}','${data.paid}',sysdate(),'admin','${data.deu_date}','${data.fee_structure_id}','${data.pay_mode}', '${data.deu_date}', '${data.fee_details}','${data.pay_mode}')`;
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
     res.send('Candidaterouter PUT Reposnse of Router');
 })
 .delete('/:id',verifyToken, (req, res)=>{
     res.send('Candidaterouter DELETE Reposnse of Router');
 })
 

module.exports = StufeeRouter;

