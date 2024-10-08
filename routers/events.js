const express = require('express');
const app = express();
const EventsRouter = express.Router();
const connection = require('../www/config');
const resultAPI = require('../controller/shared-controller');

EventsRouter.get('/', (req, res)=>{
    connection.query('select * from event_log', (err, row, feild)=>{
     if(err){ res.send(err)}else{
         res.send(resultAPI(err, row, feild, 'Succefully loaded!'));
     }
    })
 }).get('/:id', (req, res)=>{
    connection.query(`select * from event_log where id = "${req.params.id}"`, (err, row, feild)=>{
     if(err){ res.send(err)}else{
        res.send(resultAPI(err, row, feild, 'Succefully loaded!'));
     }
    })
 }).get('/byschool/:id', (req, res)=>{
    if(req.params.id){
        connection.query(`select * from event_log where school_id = '${req.params.id}'`, (err, row, feild)=>{
            if(err){ res.send(err)}else{
               res.send(resultAPI(err, row, feild, 'Succefully loaded!'));
            }
           })
    }else{
        res.send({results:null, error:true, message:'Invalid Id. Please try again!'})
    }
 }).post('/', (req, res)=>{
    if(req.body){
        let data = req.body;
        let date = new Date();        
        data.id = `${date.getDay()}${date.getMonth()}${date.getSeconds()}${date.getMinutes()}`;
        let strQuery = `INSERT INTO event_log (id, title, start_date, end_date, description, created_by, created_on, modify_on, modify_by,pic,school_id) VALUES (
        '${data.id}', '${data.title}', '${data.start_date}', '${data.end_date}', '${data.description}', 'admin', sysdate(), sysdate(), 'admin','${data.pic}','${data.school_id}')`;
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
 .put('/', (req, res)=>{
     res.send('Candidaterouter PUT Reposnse of Router');
 })
 .delete('/:id', (req, res)=>{
     res.send('Candidaterouter DELETE Reposnse of Router');
 })
 

module.exports = EventsRouter;

