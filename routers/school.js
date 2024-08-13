const express = require('express');
const app = express();
const schoolRouter = express.Router();
const connection = require('../www/config');
const resultAPI = require('../controller/shared-controller');

schoolRouter.get('/', (req, res)=>{
    connection.query('select * from school_log', (err, row, feild)=>{
     if(err){ res.send(err)}else{
         res.send(row);
     }
    })
 }).get('/:id', (req, res)=>{
    connection.query(`select * from school_log where id = "${req.params.id}"`, (err, row, feild)=>{
     if(err){ 
        res.send(resultAPI(err, row,'Error!!'));
     }else{
         res.send(resultAPI(err, row,'School Data  is coming!'));
     }
    })
 }).post('/', (req, res)=>{
    let data = req.body;
    let date = new Date();
    data.id = `${date.getDay()}${date.getMonth()}${date.getSeconds()}${date.getMinutes()}`;
    const strQuerry = `INSERT INTO school_log (id, uid, name, address1, address2,city,country,location,
    afliation,certification_no,created_on,created_by,modify_on,modify_by,branch_name,school_logcol)
VALUES('${data.id}','${data.uid}','${data.name}','${data.address1}','${data.address2}','${data.city}','${data.country}','${data.location}',
'${data.afliation}','${data.certification_no}',sysdate(),'admin',sysdate(),'admin','${data.branch_name}','${data.school_logcol}');`;
    connection.query(strQuerry, (err, rows, feilds)=>{
        res.end(resultAPI(err,rows, feilds, 'Submited Successful!'))
    })
 })
 .put('/', (req, res)=>{
     res.end('Candidaterouter PUT Reposnse of Router');
 })
 .delete('/', (req, res)=>{
     res.end('Candidaterouter DELETE Reposnse of Router');
 })
 

module.exports = schoolRouter;
