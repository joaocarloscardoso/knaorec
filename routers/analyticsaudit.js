//npm modules
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
//middleware to validate user controls
const { check, validationResult } = require('express-validator/check');
//credentials used in the app
var credentials = require('../credentials.js');
//plugins stats and catalogue
var Findings = require('../lib/findings.js');
//logging system
var log = require('../lib/log.js');
//nlp
var nlp = require('../lib/nlp.js');

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

var analyticsaudit = express.Router();

analyticsaudit.get('/Recommendations',function(req,res){
    //res.send('Hello e-gov');
    //res.json(persons);
    var NewAuditFile = credentials.WorkSetPath;
    NewAuditFile = NewAuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(NewAuditFile);
    var status = InitialAudit.VerifyAuditFile(NewAuditFile);

    if (status) {
        var CrawlerFile = credentials.WorkSetPath;
        CrawlerFile = CrawlerFile + req.sessionID + '.src';
        var TokenizerFile = credentials.WorkSetPath;
        TokenizerFile = TokenizerFile + req.sessionID + '.tkn';
        var VectorFile = credentials.WorkSetPath;
        VectorFile = VectorFile + req.sessionID + '.vec';

        var vFile = nlp.LoadCrawler(NewAuditFile, CrawlerFile);
        nlp.LoadNLPProcessing(CrawlerFile,TokenizerFile, VectorFile);
        var Vector = nlp.GetVector(VectorFile);

        res.render('toolaudit/supportanalytics', {
            action: 'audit',
            operation: 'recommendation',
            AuditErrors: '',
            Matrix: Vector,
            msg: '',
            auditfile: 'work/' + req.sessionID + '.xml',
	        audit: status
         });
    } else {
        res.render('login/login', {
            action: 'login',
            //persons: persons,
            auditfile: '',
            audit: status
        });
    }
});


module.exports = analyticsaudit;