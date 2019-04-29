var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var app = express();

var db = mongojs('metamorph', ['singup']);  // set name of database and collection name

var port = 3000;
var cors = require('cors');
// var fs = require('fs');
app.use(cors());

const loginPassword = '123456';
//View Engine
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// render home page...
app.get('/', function(req, res){
  res.render('index.html');
})

// save data of email ...
app.post('/joinus', function(req, res){
  var date = new Date();
  var day = date.getDate();
  var month = date.getMonth()+1;
  var year = date.getFullYear(); 
  var fullDate = day+'-'+month+'-'+year;
  var data =  {
    email: req.body.email,
    date: fullDate
  };
  db.singup.save(data, function(err, data){
    if(err){
      console.log('error: ', err);
      res.send({status:0, message:'failed'});
    } else{
        res.send({status:1, message:'success'});
        //res.render('index.html');
    }
  });
});

//render login page ...
app.get('/login', function(req, res){
  res.render('login.html');
});

//login user and show data...
app.post('/admin-login', async (req, res)=>{
  if(req.body.password) {
    if(req.body.password == loginPassword) {
       db.singup.find({}, function(err,data){
        if(err){
          res.render('login.html');
        } else {
          res.send({status:1, message:'success', data:data});
        }
      });
    
    } else {
        console.log('come in wrong password:');
        res.send({status:0,  data:'incorrect', message:'Please enter correct password.'});
    }
  }
});

app.listen(port, function(){
    console.log('Server started on port '+port);
});

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});


// Intentionally cause an exception, but don't catch it.
//nonexistentFunc();
//console.log('This will not run.');

