//npm modules
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
//middleware to validate user controls
const { check, validationResult } = require('express-validator/check');
//credentials used in the app
var credentials = require('../credentials.js');
//plugins stats and catalogue
var Matrices = require('../lib/matrices.js');
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

var matricesaudit = express.Router();

matricesaudit.get('/auditplanning',function(req,res){
    //res.send('Hello e-gov');
    //res.json(persons);
    var NewAuditFile = credentials.WorkSetPath;
    NewAuditFile = NewAuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(NewAuditFile);
    var status = InitialAudit.VerifyAuditFile(NewAuditFile);

    if (status) {
        var PlanMatrix = Matrices.LoadPlanMatrix(NewAuditFile, DomainId, AreaId, IssueId);
        res.render('toolaudit/toolwork', {
            action: 'audit',
            operation: 'plan_matrix',
            AuditErrors: '',
            Matrix: PlanMatrix,
            msg: '',
	        audit: status
         });
    } else {
        res.render('login/login', {
            action: 'login',
            //persons: persons,
            audit: status
        });
    }
});


module.exports = matricesaudit;