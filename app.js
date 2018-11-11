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

app.get('/',function(req,res){
   //res.send('Hello e-gov');
   //res.json(persons);
    res.render('index', {
        action: 'home',
        persons: persons
    });
});

app.get('/contactfeedback',function(req,res){
    //res.send('Hello e-gov');
    //res.json(persons);
     res.render('contactfeedback', {
         action: 'home',
         persons: persons
     });
 });

 app.get(('/' + credentials.urlpaths.plugins + ':name'),function(req,res){
    //download xml file
});

app.get('/:name',function(req,res){
    //res.send('Hello e-gov');
    //res.json(persons);
    if (req.params.name == 'project') {
        res.render('project', {
            //action: req.query.action,
            action: req.params.name,
            persons: persons
        });  
    }  else if (req.params.name == 'desktop') {
        res.render('desktop', {
            //action: req.query.action,
            action: req.params.name,
            persons: persons
        });  
    } else if (req.params.name == 'newsdesktopv2') {
        res.render('newsdesktopv2', {
            //action: req.query.action,
            action: req.params.name,
            persons: persons
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
            downloadurl: credentials.urlpaths.plugins
        });  
     } else {
        res.render('index', {
            //action: req.query.action,
            action: req.params.name,
            persons: persons
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
            errors: errors.array()
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
        console.log(newMessage);
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
    res.type('text/html');
    res.status(404);
    res.render('404');
    //res.send('404 - Not Found');
});

app.use(function(req,res,next){
    res.type('text/html');
    res.status(500);
    res.render('500');
    //res.send('500 - Server Error');
});

app.listen(3000,function(){
    console.log('Server started on port 3000...');
})