//npm modules
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
//middleware to validate user controls
const { check, validationResult } = require('express-validator/check');
//credentials used in the app
var credentials = require('../credentials.js');
//email system
var emailService = require('../lib/email.js')(credentials);
//plugins stats and catalogue
var pluginsService = require('../lib/catplugins.js')(credentials.PlugInsPath);
//logging system
var log = require('../lib/log.js');

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


var portal = express.Router();

portal.get('/tool', (req, res) => {
    //console.log('Inside GET /authrequired callback');
    //console.log(`User authenticated? ${req.isAuthenticated()}`);
    if(req.isAuthenticated()) {
        //console.log('userid2file1: ' + req.session.passport.user);
        //console.log('sessionid2file2: ' + req.sessionID);
        res.redirect('/portal/toolindex');
    } else {
        res.redirect('/login/login');
    }
});
  
portal.get('/toolindex', (req, res) => {
    var AuditFile = credentials.WorkSetPath;
    AuditFile = AuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(AuditFile);
    var status = InitialAudit.VerifyAuditFile(AuditFile);

    //console.log('Inside GET /authrequired callback');
    //console.log(`User authenticated? ${req.isAuthenticated()}`);
    if(req.isAuthenticated()) {
        res.render('portal/toolindex', {
            action: 'tool',
            auditfile: 'work/' + req.sessionID + '.xml',
	        audit: status
        });
    } else {
        res.redirect('/login/login');
    }
});  

portal.get('/contactfeedback',function(req,res){
    var AuditFile = credentials.WorkSetPath;
    AuditFile = AuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(AuditFile);
    var status = InitialAudit.VerifyAuditFile(AuditFile);

    //res.send('Hello e-gov');
    //res.json(persons);
     res.render('portal/contactfeedback', {
         action: 'home',
         auditfile: 'work/' + req.sessionID + '.xml',
         audit: status
        });
});

portal.get('/project',function(req,res){
    var AuditFile = credentials.WorkSetPath;
    AuditFile = AuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(AuditFile);
    var status = InitialAudit.VerifyAuditFile(AuditFile);

    res.render('./portal/project', {
        //action: req.query.action,
        action: req.params.name,
        auditfile: 'work/' + req.sessionID + '.xml',
        audit: status
    });  
});

portal.get('/desktop',function(req,res){
    var AuditFile = credentials.WorkSetPath;
    AuditFile = AuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(AuditFile);
    var status = InitialAudit.VerifyAuditFile(AuditFile);

    res.render('portal/desktop', {
        //action: req.query.action,
        action: req.params.name,
        auditfile: 'work/' + req.sessionID + '.xml',
        audit: status
    });  
});

portal.get('/newsdesktopv2',function(req,res){
    var AuditFile = credentials.WorkSetPath;
    AuditFile = AuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(AuditFile);
    var status = InitialAudit.VerifyAuditFile(AuditFile);

    res.render('portal/newsdesktopv2', {
        //action: req.query.action,
        action: req.params.name,
        auditfile: 'work/' + req.sessionID + '.xml',
        audit: status
    });  
});

portal.get('/catalogplugins',function(req,res){
    var AuditFile = credentials.WorkSetPath;
    AuditFile = AuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(AuditFile);
    var status = InitialAudit.VerifyAuditFile(AuditFile);

        var LastDate = pluginsService.getMostRecentFileName();
        var PluginsCatalog = pluginsService.getListOfPlugins();
        //console.log(PluginsCatalog.length)
        res.render('portal/catalogplugins', {
            //action: req.query.action,
            action: req.params.name,
            lastupdate: LastDate,
            catalog: PluginsCatalog,
            downloadurl: credentials.urlpaths.plugins,
            auditfile: 'work/' + req.sessionID + '.xml',
	        audit: status
        });  
});

portal.post('/contactus', [
    // email must be an email
    check('email').isEmail().withMessage('Invalid email!'),
    // first and last names must be at least 3 chars long
    check('name').isLength({ min: 3 }).withMessage('Name must be at least 3 chars long!'),
    check('message').isLength({ min: 3 }).withMessage('Message must be at least 3 chars long!')
  ], (req, res) => {
    var AuditFile = credentials.WorkSetPath;
    AuditFile = AuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(AuditFile);
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
       res.render('/index', {
            action: '#contact',
            message: newMessage,
            errors: errors.array(),
            auditfile: 'work/' + req.sessionID + '.xml',
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

module.exports = portal;