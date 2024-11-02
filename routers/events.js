const express = require('express');
const app = express();
const EventsRouter = express.Router();
const connection = require('../www/config');
const resultAPI = require('../controller/shared-controller');
const verifyToken = require('../controller/jwtauth');

EventsRouter.get('/', verifyToken, (req, res) => {
    connection.query('select * from event_log', (err, row, feild) => {
        if (err) { res.send(err) } else {
            res.send(resultAPI(err, row, feild, 'Succefully loaded!'));
        }
    })
}).get('/:id', verifyToken, (req, res) => {
    connection.query(`select * from event_log where id = "${req.params.id}"`, (err, row, feild) => {
        if (err) { res.send(err) } else {
            res.send(resultAPI(err, row, feild, 'Succefully loaded!'));
        }
    })
}).get('/byschool/:id', verifyToken, (req, res) => {
    if (req.params.id) {
        connection.query(`select * from event_log where school_id = '${req.params.id}'`, (err, row, feild) => {
            if (err) { res.send(err) } else {
                res.send(resultAPI(err, row, feild, 'Succefully loaded!'));
            }
        })
    } else {
        res.send({ results: null, error: true, message: 'Invalid Id. Please try again!' })
    }
}).post('/', verifyToken, (req, res) => {
    if (req.body) {
        let data = req.body;
        let date = new Date();
        data.id = `${date.getDay()}${date.getMonth()}${date.getSeconds()}${date.getMinutes()}`;
        let strQuery = `INSERT INTO event_log (id, title, start_date, end_date, description, created_by, created_on, modify_on, modify_by,pic,school_id, status, class, section) VALUES (
        '${data.id}', '${data.title}', '${data.start_date}', '${data.end_date}', '${data.description}', 'admin', sysdate(), sysdate(), 'admin','${data.pic}','${data.school_id}','${data.status}', '${data.class}', '${data.section}')`;
        connection.query(strQuery, (err, rows, feilds) => {
            if (err) {
                res.send(resultAPI(err, rows, feilds, 'Invalid Entry!'));
            }
            else {
                res.send(resultAPI(err, rows, feilds, 'Succefully Submited!'));
            }
        })
    } else {
        res.send(resultAPI(null, null, null, 'Something went wrong!'));
    }
})
    .put('/', verifyToken, (req, res) => {
        let data = req.body;
        if (data) {
            let strQuary = `UPDATE event_log SET title='${data.title}', pic='${data.pic}', modify_by='${data.created_by}', modify_on=sysdate(), status='${data.status}' WHERE id='${data.id}'`;
            connection.query(strQuary, (err, rows, feild) => {
                if (err) res.send(resultAPI(err, rows, feild, 'Error in Event data!'))
                else res.send(resultAPI(err, rows, feild, 'Successfuly updated!'))
            })
        } else {
            res.send(resultAPI(null, null, null, 'Something went wrong!'));
        }
    })
    .delete('/:id', verifyToken, (req, res) => {
        res.send('Candidaterouter DELETE Reposnse of Router');
    })


module.exports = EventsRouter;

