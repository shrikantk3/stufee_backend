const express = require('express');
const app = express();
const conn = require('./www/config');
// const _router = require('./routers/index');
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
conn.connect(err=>{
    if(err){
        throw err;
    }else{
        console.log('*********** DB Connection working !');
    }
})
// app.use('/', _router);


app.listen(8080, err=>{
    if(err){throw err};
    console.log('*********** Server running at :', 8080);
});