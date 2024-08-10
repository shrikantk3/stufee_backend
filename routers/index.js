const express = require('express');
const Authrouter = require('./auth');
// const Candidaterouter = require('./candidate');
const Approuter = express.Router();

// Approuter.use('/candidate', Candidaterouter);
// Approuter.use('/tutor', Candidaterouter);
Approuter.use('/auth', Authrouter);
console.log("HI I am Stufee")
module.exports = Approuter;
