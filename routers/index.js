const express = require('express');
const Authrouter = require('./auth');
const schoolRouter = require('./school');
const studentRouter = require('./student');
const teacherRouter = require('./teacher');
const parentRouter = require('./parent');
const EventsRouter = require('./events');
const SchoolFeeRouter = require('./schoolFee');
const StufeeRouter = require('./stufee');
const FeeRouter = require('./fee');
const ClassRouter = require('./class');
const SectionRouter = require('./section');
const  FinancialYearRouter= require('./finacial_year');
const TicketRouter = require('./ticket');
const ReportRouter = require('./reports');
// const adminRouter = require('./');
const Approuter = express.Router();


Approuter.use('/auth', Authrouter);
Approuter.use('/school', schoolRouter);
Approuter.use('/student', studentRouter);
Approuter.use('/teacher', teacherRouter);
Approuter.use('/parent', parentRouter);
Approuter.use('/events', EventsRouter);
Approuter.use('/schoolfee', SchoolFeeRouter);
Approuter.use('/fee', FeeRouter);
Approuter.use('/stufee', StufeeRouter);
Approuter.use('/class', ClassRouter);
Approuter.use('/section', SectionRouter);
Approuter.use('/finyear', FinancialYearRouter);
Approuter.use('/ticket', TicketRouter);
Approuter.use('/reports', ReportRouter);

// Approuter.use('/admin', adminRouter);
module.exports = Approuter;
