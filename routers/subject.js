const express = require('express');
const app = express();
const SubjectsRouter = express.Router();
const connection = require('../www/config');
const resultAPI = require('../controller/shared-controller');
const verifyToken = require('../controller/jwtauth')

SubjectsRouter.get('/',verifyToken, (req, res)=>{
    connection.query('select * from subject_log', (err, row, feild)=>{
     if(err){  res.send(resultAPI(err, row, feild, 'Error!'));}
     else{
         res.send(resultAPI(err, row, feild, 'Succefully loaded!'));
     }
    })
 }).get('/:id',verifyToken, (req, res)=>{
    connection.query(`select * from subject_log where id = "${req.params.id}"`, (err, row, feild)=>{
     if(err){ res.send(resultAPI(err, row, feild, 'Error!'));}else{
        res.send(resultAPI(err, row, feild, 'Succefully loaded!'));
     }
    })
 }).get('/byschool/:id',verifyToken, (req, res)=>{
    if(req.params.id){
        connection.query(`select sb.*, cl.name as class_name from subject_log sb INNER JOIN class_log cl where cl.id=sb.class_id and sb.school_id = '${req.params.id}'`, (err, row, feild)=>{
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
        connection.query(`select sb.*, cl.name as class_name from subject_log sb INNER JOIN class_log cl where cl.id=sb.class_id and sb.school_id='${req.params.id}' and sb.class_id='${req.params.class_id}'`, (err, row, feild)=>{
            if(err){  res.send(resultAPI(err, row, feild, 'Error!'));}
            else{
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
        let strQuery = `INSERT INTO subject_log (id, name,school_id,class_id,section_id,fin_year, created_by, created_on, modify_on, modify_by) VALUES (${data.id},'${data.name}','${data.school_id}','${data.class_id}','${data.section_id}','${data.fin_year}','${data.created_by?data.created_by:'admin'}', sysdate(), sysdate(),'${data.modify_by?data.modify_by:'admin'}')`;
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
 

module.exports = SubjectsRouter;

