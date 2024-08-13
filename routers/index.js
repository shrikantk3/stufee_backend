const express = require('express');
const Authrouter = require('./auth');
const schoolRouter = require('./school');
const studentRouter = require('./student');
const Approuter = express.Router();


Approuter.use('/auth', Authrouter);
Approuter.use('/school', schoolRouter);
Approuter.use('/student', studentRouter);
module.exports = Approuter;
