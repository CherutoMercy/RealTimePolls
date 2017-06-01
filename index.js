var express = require('express');
var app = express();
var ejs = require('ejs');
var engine = require('ejs-mate');
var path = require('path');
var flash = require('connect-flash');
var mongoose= require('mongoose');
var bodyParser=require('body-parser');
var fs = require('fs');
var multer = require('multer');
var morgan       = require('morgan');
var session = require('express-session');
var MongoStore       =  require('connect-mongo')(session);
var expressValidator = require('express-validator');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var db      ='mongodb://localhost:27017/polls';
mongoose.connect(db);

// set static folder
app.use(express.static(__dirname + '/assets'));
app.use(express.static(path.join(__dirname, 'views')));



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(expressValidator()); 
app.use(cookieParser());
app.use(morgan('dev'));

app.use(morgan('dev'));
app.use(session({
    secret: 'anything',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        url: db,
        touchAfter: 24 * 3600
    })
  }));


//Create EJS Engine view
app.set('view engine', 'html');
app.engine('ejs', engine);
app.set('view engine', 'ejs');

require('./config/passport')(passport);

app.use(passport.initialize());

app.use(passport.session());

app.use(flash());

app.use((req,res,next)=>{
  res.locals.user   = req.user;
  res.locals.message = req.flash();
  next();
});


var routes = require('./routes/index.js');
app.use(routes);


server.listen(4000, () => {
    console.log('Awesome server running on port 4000');
});

module.exports = app;
