//npm modules
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
//middleware to validate user controls
const { check, validationResult } = require('express-validator/check');
//credentials used in the app
var credentials = require('./credentials.js');
//email system
var emailService = require('./lib/email.js')(credentials);
//plugins stats and catalogue
var pluginsService = require('./lib/catplugins.js')(credentials.PlugInsPath);
//logging system
var log = require('./lib/log.js');
//generation of uuid
const uuid = require('uuid/v4');
//session handling and store
const session = require('express-session');
const FileStore = require('session-file-store')(session);
//configure Passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//requests to users database handler
const axios = require('axios');
//module to hash passwords
const bcrypt = require('bcrypt-nodejs');
//file uploads
var formidable = require('formidable');
var fs = require("fs");

//routers declaration
var PortalRouter =require('./routers/portal.js');
var LoginRouter =require('./routers/login.js');
var ToolAuditRouter =require('./routers/toolaudit.js');
var PreassessmentRouter =require('./routers/preassessaudit.js');


// configure passport.js to use the local strategy
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) => {
      axios.get(`http://localhost:5000/users?email=${email}`)
      .then(res => {
        const user = res.data[0]
        if (!user) {
            return done(null, false, { message: 'Invalid credentials.\n' });
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false, { message: 'Invalid credentials.\n' });
        }
        return done(null, user);
      })
      .catch(error => done(error));
    }
));
  

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
    console.log('Inside serializeUser callback. User id is save to the session file store here');
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    axios.get(`http://localhost:5000/users/${id}`)
    .then(res => done(null, res.data) )
    .catch(error => done(error, false))
});
      
var app = express();

//View Engine
app.set('view engine','ejs');
//specify folder for views
app.set('views',path.join(__dirname,'views'));

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//set static path to be used for support documents, like css or angular
app.use(express.static(path.join(__dirname,'public')));


//to make variables global place them here 
app.use(function(req,res,next){
    res.locals.errors = null;
    next();
});

// add and configure session middleware
app.use(session({
    genid: (req) => {
      //console.log('Inside the session middleware')
      //log.info(req.sessionID);
       return uuid(); // use UUIDs for session IDs
    },
    secret: credentials.cookieSecret,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/',function(req,res){
    log.info('Session created received the id:' + req.sessionID);
    var AuditFile = credentials.WorkSetPath;
    AuditFile = AuditFile + req.sessionID + '.xml';
    var InitialAudit = require('./lib/initialaudit.js')(AuditFile);
    var status = InitialAudit.VerifyAuditFile(AuditFile);

    res.render('index', {
        action: 'home',
        audit: status
        //persons: persons
    });
});

app.get('/index',function(req,res){
    log.info('Session created received the id:' + req.sessionID);
    var AuditFile = credentials.WorkSetPath;
    AuditFile = AuditFile + req.sessionID + '.xml';
    var InitialAudit = require('./lib/initialaudit.js')(AuditFile);
    var status = InitialAudit.VerifyAuditFile(AuditFile);

    res.render('index', {
        action: 'home',
        audit: status
        //persons: persons
    });
});
  
app.get(('/portal/' + credentials.urlpaths.plugins + ':name'),function(req,res){
    //download xml file
    var file = __dirname + '/' + credentials.urlpaths.plugins + req.params.name
    var file = file.replace("/","\\");
    res.download(file); // Set disposition and send it.
    log.info('plug-in download: ' + file);
});

app.use('/portal', PortalRouter);
app.use('/login', LoginRouter);
app.use('/toolaudit', ToolAuditRouter);
app.use('/preassessaudit', PreassessmentRouter);

app.use(function(req,res,next){
    log.warn('404 - Not Found');
    res.type('text/html');
    res.status(404);
    res.render('404');
    //res.send('404 - Not Found');
});

app.use(function(req,res,next){
    log.warn('500 - Server Error');
    res.type('text/html');
    res.status(500);
    res.render('500');
    //res.send('500 - Server Error');
});

app.listen(3000,function(){
    console.log('Server started on port 3000...');
})