const express = require('express');
const app = express();
const schoolRouter = express.Router();
const connection = require('../www/config');
const resultAPI = require('../controller/shared-controller');
const verifyToken = require('../controller/jwtauth')

schoolRouter.get('/', (req, res)=>{
    connection.query('select * from school_log', (err, row, feild)=>{
     if(err){ res.send(err)}else{
         res.send(row);
     }
    })
 }).get('/:id', (req, res)=>{
    connection.query(`select * from school_log where id = '${req.params.id}'`, (err, row, feild)=>{
     if(err){ 
        res.send(resultAPI(err, row,feild, 'Error!!'));
     }else{
         res.send(resultAPI(err, row,feild, 'School Data fetched successfully!'));
     }
    })
 }).get('/byuser/:uid', verifyToken, (req, res)=>{
    connection.query(`select * from school_log where uid = '${req.params.uid}'`, (err, row, feild)=>{
     if(err){ 
        res.send(resultAPI(err, row,feild, 'Error!!'));
     }else{
         res.send(resultAPI(err, row,feild, 'School Data fetched successfully!'));
     }
    })
 }).post('/',verifyToken, (req, res)=>{
    let data = req.body;
    let date = new Date();
    data.id = `${date.getDay()}${date.getMonth()}${date.getSeconds()}${date.getMinutes()}`;
    const strQuerry = `INSERT INTO school_log (id, uid, name, phone, email, address1, address2,city,country,location,
    afliation,certification_no,created_on,created_by,modify_on,modify_by,branch_name,school_docs,active,persona,logo, stamp_logo, subscription)
VALUES('${data.id}','${data.uid}','${data.name}','${data.phone}','${data.email}','${data.address1}','${data.address2}','${data.city}','${data.country}','${data.location}',
'${data.afliation}','${data.certification_no}',sysdate(),'admin',sysdate(),'admin','${data.branch_name}','${data.school_docs}',
'${data.active}','${data.persona}','${data.logo}','${data.stamp_logo}','${data.subscription}');`;
    connection.query(strQuerry, (err, rows, feilds)=>{
        res.send(resultAPI(err,rows, feilds, 'Submited Successful!'))
    })
 })
 .put('/',verifyToken, (req, res)=>{
     res.send('Candidaterouter PUT Reposnse of Router');
 })
 .delete('/',verifyToken, (req, res)=>{
     res.send('Candidaterouter DELETE Reposnse of Router');
 })
 

module.exports = schoolRouter;
