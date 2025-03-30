// const express = require('express');
// const app = express();
// const conn = require('./www/config');
// const _router = require('./routers/index');
// const path = require('path');
// const bodyParser = require('body-parser');
// const ErrorHandler = require('./www/errorhandler');


// const cors = require('cors');

// app.use(cors());
// app.use(bodyParser.json());
// app.use(express.static('public'));
// app.use('/assets', express.static('assets'));

// app.set("assets", path.join(__dirname, "assets"));
// app.set("view engine", "ejs");


// conn.connect(err=>{
//     if(err){
//         throw err;
//     }else{
//         console.log('*********** DB Connection working !');
//     }
// })
// app.use('/', _router);


// app.get('/images/:filename', (req, res) => {
//     const filename = req.params.filename;
//     const imagePath = path.join(__dirname, 'assets/images', filename);
  
//     res.sendFile(imagePath);
//   });
// app.use(ErrorHandler);
// app.listen(8080, err=>{
//     if(err){throw err};
//     console.log('*********** Server running at :', 8080);
// });


const express = require('express');
const app = express();
const conn = require('./www/config');
const _router = require('./routers/index');
const path = require('path');
const ErrorHandler = require('./www/errorhandler');
const cors = require('cors');

// Environment configuration
// require('dotenv').config(); // If using environment variables

// Middleware setup
app.use(cors());
app.use(express.json()); // Built-in body parser (replaces body-parser)
app.use(express.urlencoded({ extended: true })); // For form data

// Static files
app.use(express.static('public'));
app.use('/assets', express.static(path.join(__dirname, 'assets'))); // Better path handling

// View engine setup
app.set("views", path.join(__dirname, "views")); // Explicit views directory
app.set("view engine", "ejs");

// Database connection with better error handling
conn.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        process.exit(1); // Exit if DB connection fails
    }
    console.log('*********** DB Connection working!');
});

// Routes
app.use('/', _router);

// Image serving route with error handling
app.get('/images/:filename', (req, res, next) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, 'assets/images', filename);
    
    res.sendFile(imagePath, (err) => {
        if (err) {
            err.status = 404; // Not Found
            next(err); // Pass to error handler
        }
    });
});

// Error handling middleware (should be last)
app.use(ErrorHandler);

// Server startup with graceful shutdown
const server = app.listen(process.env.PORT || 8080, () => {
    console.log('*********** Server running at:', server.address().port);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => process.exit(1));
});

// Handle SIGTERM for graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
    });
});