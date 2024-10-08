const express = require('express');
const app = express();
const studentRouter = express.Router();
const connection = require('../www/config');
const resultAPI = require('../controller/shared-controller');

studentRouter.get('/', (req, res) => {
    connection.query('select * from student_log', (err, row, feild) => {
        if (err) { res.send(err) } else {
            res.send(row);
        }
    })
}).get('/:id', (req, res) => {
    connection.query(`select * from student_log where uid = '${req.params.id}'`, (err, row, feild) => {
        if (err) { res.send(err) } else {
            res.send(row);
        }
    })
}).get('/byschool/:id', (req, res) => {
    connection.query(`select * from student_log where school_id = '${req.params.id}'`, (err, row, feild) => {
        if (err) { res.send(err) } else {
            res.send(row);
        }
    })
})
    .post('/', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        if (req.body) {
            let data = req.body;
            let date = new Date();
            data.id = `${date.getDay()}${date.getMonth()}${date.getSeconds()}${date.getMinutes()}`;
            let str = `Insert INTO student_log (id, uid, fname, mname, lname, full_name, city, country, class, school_id, section, phone, address1, address2, email, parent_id, created_by, created_on, modify_by, modify_on, dob, doa) 
            VALUES ('${data.id}', '${data.uid}', '${data.fname}','${data.mname}', '${data.lname}','${data.fname} ${data.mname} ${data.lname}', '${data.city}',
             '${data.country}', '${data.class}','${data.school_id}','${data.section}','${data.phone}','${data.address1}','${data.address2}','${data.email}','${data.parent_id}','admin',sysdate(),'admin',sysdate(), '${data.dob}', '${data.doa}')`;
            console.log(str);
             connection.query(str, (err, rows, feilds) => {
                if (err) {
                    res.send(resultAPI(err, rows, feilds, 'Data error!'))
                }
                else {
                    res.send(resultAPI(err, rows, feilds, 'Data successful!'))
                }
            })
        }
    })
    .put('/', (req, res) => {
        if (req.body) {
            let data = req.body;
            res.setHeader('Access-Control-Allow-Origin', '*');
            let str = `UPDATE student_log SET fname='${data.fname}', mname='${data.mname}', lname='${data.lname}', 
            city='${data.city}', country='${data.country}', class='${data.class}', school_id='${data.school_id}', 
            section='${data.section}', phone='${data.phone}', address1='${data.address1}', address2='${data.address2}', 
            email='${data.email}', parent_id='${data.parent_id}',modify_by='admin', modify_on=sysdate() WHERE uid ='${data.uid}'`;
            connection.query(str, (err, rows, feilds) => {
                if (err) {
                    res.send(resultAPI(err, rows, feilds, 'Data error!'))
                }
                else {
                    res.send(resultAPI(err, rows, feilds, 'Data successful!'))
                }
            })
        }
    })
    .delete('/', (req, res) => {
        res.send('studentRouter DELETE Reposnse of Router');
    })


module.exports = studentRouter;
