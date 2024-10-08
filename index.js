const express = require('express');
const app = express();
const conn = require('./www/config');
const _router = require('./routers/index');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/assets', express.static('assets'));

app.set("assets", path.join(__dirname, "assets"));
app.set("view engine", "ejs");


conn.connect(err=>{
    if(err){
        throw err;
    }else{
        console.log('*********** DB Connection working !');
    }
})
app.use('/', _router);


app.get('/images/:filename', (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, 'assets/images', filename);
  
    res.sendFile(imagePath);
  });

app.listen(8080, err=>{
    if(err){throw err};
    console.log('*********** Server running at :', 8080);
});
