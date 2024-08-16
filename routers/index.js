const express = require('express');
const Authrouter = require('./auth');
const schoolRouter = require('./school');
const studentRouter = require('./student');
const teacherRouter = require('./teacher');
const Approuter = express.Router();


Approuter.use('/auth', Authrouter);
Approuter.use('/school', schoolRouter);
Approuter.use('/student', studentRouter);
Approuter.use('/teacher', teacherRouter);
module.exports = Approuter;
