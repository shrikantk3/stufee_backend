const express = require('express');
const app = express();
const ReportRouter = express.Router();
const connection = require('../www/config');
const resultAPI = require('../controller/shared-controller');
const verifyToken = require('../controller/jwtauth');

ReportRouter.get('/',verifyToken, (req, res)=>{
    connection.query('select * from student_log', (err, row, feild)=>{
     if(err){ res.send(err)}else{
         res.send(resultAPI(err, row, feild, 'Succefully loaded!'));
     }
    })
 }).post('/',verifyToken, (req, res)=>{
    let data = req.body;
    let sql_param = '';
    if(data.report){
        for(const[key, value] of Object.entries(data)){
            if(value && key!=='report'){
                sql_param +=`${sql_param!==''?'and':''} ${key}='${value}'`;
            }
        }
        let strQaury = `select * from ${data.report}_log ${sql_param!==''?'where':''} ${sql_param}`; 
        connection.query(strQaury, (err, row, feild)=>{
            if(err){ res.send(err)}else{
                res.send(resultAPI(err, row, feild, 'Succefully loaded!'));
            }
        })
    }
    
 }).post('/std_info',verifyToken, (req, res)=>{
    let data = req.body;
    let sql_param = '';
    let totalStudent = 0;
    let totalMale = 0;
    let totalFemale = 0;
    let totalOther = 0;
    let activeStudent = 0;
    let inactiveStudent = 0;  
    if(data.school_id){
        let strQaury = `select * from student_log where school_id = '${data.school_id}'`; 
        connection.query(strQaury, (err, row, feild)=>{
            if(err){ res.send(err)}else{
                row.forEach((element)=>{
                    element.active?activeStudent++:inactiveStudent++;
                    if(element.gender === 'male')totalMale++;
                    if(element.gender === 'female')totalFemale++;
                    if(element.gender === 'other')totalOther++;
                    totalStudent++;
                })
            }
            res.send({
                totalStudent:totalStudent,
                activeStudent: activeStudent, 
                inactiveStudent:inactiveStudent, 
                totalMale:totalMale, totalFemale:totalFemale, 
                totalOther:totalOther}) 
        })
    }
})
.get('/std_year_details',verifyToken, (req, res)=>{
    connection.query('select * from student_log', (err, row, feild)=>{
        if(err){ res.send(err)}else{
               
        }
    })
})

module.exports = ReportRouter;

