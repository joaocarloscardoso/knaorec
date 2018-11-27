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

/*
//middleware should positioned before router
var logger = function(req, res, next){
    console.log('Logging...');
    next();
};

app.use(logger);
*/

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

/*
var persons = [
    {
        id: 1,
        first_name: 'Jeff',
        last_name: 'Bridges',
        email: 'jeffbridges@gmail.com'
    },
    {
        id: 2,
        first_name: 'John',
        last_name: 'Doe',
        email: 'johndoe@gmail.com'
    },
    {
        id: 3,
        first_name: 'Sara',
        last_name: 'Palin',
        email: 'sarapalin@gmail.com'
    }
];
*/

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
    //res.send('Hello e-gov');
    //res.json(persons);
    //const uniqueId = uuid();
    log.info('Session created received the id:' + req.sessionID);
    var AuditFile = path.join(__dirname,'work');
    AuditFile = AuditFile + '/' + req.sessionID + '.xml';
    var InitialAudit = require('./lib/initialaudit.js')(AuditFile);
    var status = InitialAudit.VerifyAuditFile(AuditFile);

    res.render('index', {
        action: 'home',
        audit: status
        //persons: persons
    });
});

// create the login get and post routes  
app.get('/login',function(req,res){
    var AuditFile = path.join(__dirname,'work');
    AuditFile = AuditFile + '/' + req.sessionID + '.xml';
    var InitialAudit = require('./lib/initialaudit.js')(AuditFile);
    var status = InitialAudit.VerifyAuditFile(AuditFile);

    res.render('login', {
        action: 'login',
        audit: status
    });
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        log.info(`req.user: ${JSON.stringify(req.user)}`);
        if(info) {return res.send(info.message)}
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.login(user, (err) => {
            if (err) { return next(err); }
            log.info(`Session id started: ${JSON.stringify(req.session.passport)}`);
            log.info(`User logged in: ${JSON.stringify(req.user)}`);
            return res.redirect('/tool');
        })
    })(req, res, next);
});
  
app.get('/tool', (req, res) => {
    //console.log('Inside GET /authrequired callback');
    //console.log(`User authenticated? ${req.isAuthenticated()}`);
    if(req.isAuthenticated()) {
        //console.log('userid2file1: ' + req.session.passport.user);
        //console.log('sessionid2file2: ' + req.sessionID);
        res.redirect('/toolindex');
    } else {
        res.redirect('/login');
    }
});
  
app.get('/toolindex', (req, res) => {
    var AuditFile = path.join(__dirname,'work');
    AuditFile = AuditFile + '/' + req.sessionID + '.xml';
    var InitialAudit = require('./lib/initialaudit.js')(AuditFile);
    var status = InitialAudit.VerifyAuditFile(AuditFile);

    //console.log('Inside GET /authrequired callback');
    //console.log(`User authenticated? ${req.isAuthenticated()}`);
    if(req.isAuthenticated()) {
        res.render('toolindex', {
            action: 'tool',
	        audit: status
        });
    } else {
        res.redirect('/login');
    }
});  

app.get('/toolauditreference',function(req,res){
    //res.send('Hello e-gov');
    //res.json(persons);
    var NewAuditFile = path.join(__dirname,'work');
    NewAuditFile = NewAuditFile + '/' + req.sessionID + '.xml';
    var InitialAudit = require('./lib/initialaudit.js')(NewAuditFile);
    var status = InitialAudit.VerifyAuditFile(NewAuditFile);

    if (status) {
        var AuditReference = InitialAudit.GetAuditReference(NewAuditFile);
        console.log(AuditReference);
        res.render('toolwork', {
            action: 'audit',
            operation: 'audit_reference',
            AuditReference: AuditReference,
            AuditErrors: '',
            msg: '',
	        audit: status
         });
    } else {
        res.render('login', {
            action: 'login',
            //persons: persons,
            audit: status
        });
    }
});

app.get('/toolauditplugins',function(req,res){
    //res.send('Hello e-gov');
    //res.json(persons);
    var NewAuditFile = path.join(__dirname,'work');
    NewAuditFile = NewAuditFile + '/' + req.sessionID + '.xml';
    var InitialAudit = require('./lib/initialaudit.js')(NewAuditFile);
    var status = InitialAudit.VerifyAuditFile(NewAuditFile);

    if (status) {
        var PluginsCatalog = pluginsService.getPluginsForAudit(NewAuditFile);
        res.render('toolwork', {
            action: 'audit',
            operation: 'audit_plugins',
            AuditErrors: '',
            catalog: PluginsCatalog,
            msg: '',
	        audit: status
         });
    } else {
        res.render('login', {
            action: 'login',
            //persons: persons,
            audit: status
        });
    }
});

app.get('/contactfeedback',function(req,res){
    var AuditFile = path.join(__dirname,'work');
    AuditFile = AuditFile + '/' + req.sessionID + '.xml';
    var InitialAudit = require('./lib/initialaudit.js')(NewAuditFile);
    var status = InitialAudit.VerifyAuditFile(NewAuditFile);

    //res.send('Hello e-gov');
    //res.json(persons);
     res.render('contactfeedback', {
         action: 'home',
         audit: status
        });
});

 app.get(('/' + credentials.urlpaths.plugins + ':name'),function(req,res){
    //download xml file
    var file = __dirname + '/' + credentials.urlpaths.plugins + req.params.name
    var file = file.replace("/","\\");
    res.download(file); // Set disposition and send it.
    log.info('plug-in download: ' + file);
});

app.get('/:name',function(req,res){
    var AuditFile = path.join(__dirname,'work');
    AuditFile = AuditFile + '/' + req.sessionID + '.xml';
    var InitialAudit = require('./lib/initialaudit.js')(AuditFile);
    var status = InitialAudit.VerifyAuditFile(AuditFile);

    //res.send('Hello e-gov');
    //res.json(persons);
    if (req.params.name == 'project') {
        res.render('project', {
            //action: req.query.action,
            action: req.params.name,
            audit: status
        });  
    }  else if (req.params.name == 'desktop') {
        res.render('desktop', {
            //action: req.query.action,
            action: req.params.name,
	        audit: status
        });  
    } else if (req.params.name == 'newsdesktopv2') {
        res.render('newsdesktopv2', {
            //action: req.query.action,
            action: req.params.name,
	        audit: status
        });  
    } else if (req.params.name == 'catalogplugins') {
        var LastDate = pluginsService.getMostRecentFileName();
        var PluginsCatalog = pluginsService.getListOfPlugins();
        //console.log(PluginsCatalog.length)
        res.render('catalogplugins', {
            //action: req.query.action,
            action: req.params.name,
            lastupdate: LastDate,
            catalog: PluginsCatalog,
            downloadurl: credentials.urlpaths.plugins,
	        audit: status
        });  
     } else {
        res.render('index', {
            //action: req.query.action,
            action: req.params.name,
	        audit: status
        });   
    }
  });

app.post('/contactus', [
    // email must be an email
    check('email').isEmail().withMessage('Invalid email!'),
    // first and last names must be at least 3 chars long
    check('name').isLength({ min: 3 }).withMessage('Name must be at least 3 chars long!'),
    check('message').isLength({ min: 3 }).withMessage('Message must be at least 3 chars long!')
  ], (req, res) => {
    var AuditFile = path.join(__dirname,'work');
    AuditFile = AuditFile + '/' + req.sessionID + '.xml';
    var InitialAudit = require('./lib/initialaudit.js')(AuditFile);
    var status = InitialAudit.VerifyAuditFile(AuditFile);

    // Get content
    var newMessage = {
        name: req.body.name,
        message: req.body.message,
        email: req.body.email
    };
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //return res.status(422).json({ errors: errors.array() });
       res.render('index', {
            action: '#contact',
            message: newMessage,
            errors: errors.array(),
	        audit: status
        });
    }
    else {
        res.render('templates/mailcontact', 
            { layout: null, message: newMessage }, function(err,html){
                if( err ) console.log('error in email template');

                emailService.send(credentials.AITAMmail,
                    'Information request from AITAM website',
                    html);
            }
        );        
        res.redirect(303,'contactfeedback')
        //console.log(newMessage);
    }
});

app.post('/tooleditaudit', function(req, res){
    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname,'work');
    
    form.on('fileBegin', function(field, file) {
        //rename the incoming file to the file's name
        file.path = form.uploadDir + '/' + req.sessionID + '.xml';
    });   

    form.parse(req, function(err, fields, files){
        var AuditFile = path.join(__dirname,'work');
        AuditFile = AuditFile + '/' + req.sessionID + '.xml';
        var InitialAudit = require('./lib/initialaudit.js')(AuditFile);
        var status = InitialAudit.VerifyAuditFile(AuditFile);

        if(err) { 
            log.warn('Error loading file from user ' + req.session.passport.user +'!');
            return res.render('toolindex', {
                action: 'tool',
                audit: status
            });
        }
        log.info(`User (` +  req.session.passport.user + `) uploaded a file: ${JSON.stringify(files)}`);
        //res.redirect(303, '/thank-you');
        //var CheckedAuditFile = path.join(__dirname,'work');
        //CheckedAuditFile = CheckedAuditFile + '/' + req.sessionID + '.xml';
 
        return res.render('toolwork', {
            action: 'audit',
            operation: 'audit_creation',
            msg: 'Load completed successfuly!',
	        audit: status
        });
    });
    /*
    form.on('error', function(err) {
        console.log("an error has occured with form upload");
        console.log(err);
        request.resume();
    });
    form.on('aborted', function(err) {
        console.log("user aborted upload");
    });
    */
});  

app.post('/toolnewaudit', function(req, res){
    var NewAuditFile = path.join(__dirname,'work');
    NewAuditFile = NewAuditFile + '/' + req.sessionID + '.xml';

    //Create new audit file
    var InitialAudit = require('./lib/initialaudit.js')(NewAuditFile);
    InitialAudit.CreateInitialAuditXML();
    //res.redirect(303, '/thank-you');
    return res.render('toolwork', {
        action: 'audit',
        operation: 'audit_creation',
        msg: 'New audit created successfuly!',
        audit: true
    });
});  

app.post('/toolauditreference', [
    check('auditid').isLength({ min: 2 }).withMessage('Audit ID must be at least 2 chars long!'),
    check('title').isLength({ min: 3 }).withMessage('Audit Title must be at least 3 chars long!')
  ], (req, res) => {
    // Get content
    var AuditReference = {
        AuditId: req.body.auditid,
        Title: req.body.title,
        Background: req.body.background,
        Scope: req.body.scope
    };

    var AuditFile = path.join(__dirname,'work');
    AuditFile = AuditFile + '/' + req.sessionID + '.xml';

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //return res.status(422).json({ errors: errors.array() });
        res.render('toolwork', {
            action: 'audit',
            operation: 'audit_reference',
            AuditReference: AuditReference,
            AuditErrors: errors.array(),
            msg: '',
            audit: true
         });
    }
    else {
        //Save reference on audit file
        var InitialAudit = require('./lib/initialaudit.js')(AuditFile);
        InitialAudit.SetAuditReference(AuditFile,AuditReference)

        res.render('toolwork', {
            action: 'audit',
            operation: 'audit_reference',
            AuditReference: AuditReference,
            AuditErrors: '',
            msg: 'Audit saved successfuly! Use "Download" command under "Audit" menu to get the file.',
            audit: true
         });
    }
});

/*
app.post('/users/add',function(req,res){
    var newPerson = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email
    };
    
    console.log(newPerson);
    //console.log('Form submitted');
});
*/

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