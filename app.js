var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
//middleware to validate user controls
const { check, validationResult } = require('express-validator/check');

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
        title: 'E-GOV',
        persons: persons
    });
});

app.post('/users/add', [
    // email must be an email
    check('email').isEmail().withMessage('Invalid email!'),
    // first and last names must be at least 3 chars long
    check('first_name').isLength({ min: 3 }).withMessage('First Name must be at least 3 chars long!'),
    check('last_name').isLength({ min: 3 }).withMessage('Last Name must be at least 3 chars long!')
  ], (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //return res.status(422).json({ errors: errors.array() });
        res.render('index', {
            title: 'E-GOV',
            persons: persons,
            errors: errors.array()
        });
    }
    else {
        var newPerson = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        };
        console.log(newPerson);
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