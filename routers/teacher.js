const express = require('express');
const app = express();
const teacherRouter = express.Router();
const connection = require('../www/config');

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
     res.end('Candidaterouter POST Reposnse of Router');
 })
 .put('/', (req, res)=>{
     res.end('Candidaterouter PUT Reposnse of Router');
 })
 .delete('/', (req, res)=>{
     res.end('Candidaterouter DELETE Reposnse of Router');
 })
 

module.exports = teacherRouter;
