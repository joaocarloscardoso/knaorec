//npm modules
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
//middleware to validate user controls
const { check, validationResult } = require('express-validator/check');
//credentials used in the app
var credentials = require('../credentials.js');
//plugins stats and catalogue
var Planning = require('../lib/planning.js');
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

var planaudit = express.Router();

planaudit.get('/auditplanning',function(req,res){
    //res.send('Hello e-gov');
    //res.json(persons);
    var NewAuditFile = credentials.WorkSetPath;
    NewAuditFile = NewAuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(NewAuditFile);
    var status = InitialAudit.VerifyAuditFile(NewAuditFile);

    if (status) {
        var plancatalog = Planning.LoadPlanning(NewAuditFile);
        res.render('toolaudit/toolwork', {
            action: 'audit',
            operation: 'audit_plan',
            AuditErrors: '',
            plancatalog: plancatalog,
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

planaudit.post('/auditplanning', function(req, res){
    //old: path.join(__dirname,'work')
    var NewAuditFile = credentials.WorkSetPath;
    NewAuditFile = NewAuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(NewAuditFile);
    var status = InitialAudit.VerifyAuditFile(NewAuditFile);
    
    if (status) {
        //check if req.body is filled
        if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
            log.warn('Object req.body missing on tool audit plugins');
        } else {
            var totalCtrl = req.body.rows_count;
            var Catalog = [];
            for ( var i = 1; i <= totalCtrl; i ++) {
                var NewEntry = {
                    PluginId: req.body['#' + i.toString() + 'Plugin'],
                    DomainId: req.body['#' + i.toString() + 'Domain'],
                    AreaId: req.body['#' + i.toString() + 'Area'],
                    IssueId: req.body['#' + i.toString() + 'Issue'],
                    Risk: req.body['#' + i.toString() + 'Risk'],
                    Selected: req.body['#' + i.toString() + 'Include'],
                    Remarks: req.body['#' + i.toString() + 'Remarks']
                };
                Catalog.push(NewEntry);
            }
            //save plugins selected for audit
            var status = Planning.SavePlanning(NewAuditFile, Catalog);

            var plancatalog = Planning.LoadPlanning(NewAuditFile);
            res.render('toolaudit/toolwork', {
                action: 'audit',
                operation: 'audit_plan',
                AuditErrors: '',
                plancatalog: plancatalog,
                msg: 'Audit saved successfuly! Use "Download" command under "Audit" menu to get the file.',
                audit: status
             });
        }
    } else {
        res.render('login/login', {
            action: 'login',
            //persons: persons,
            audit: status
        });
    }    
});

planaudit.get('/syncauditplanning',function(req,res){
    //res.send('Hello e-gov');
    //res.json(persons);
    var NewAuditFile = credentials.WorkSetPath;
    NewAuditFile = NewAuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(NewAuditFile);
    var status = InitialAudit.VerifyAuditFile(NewAuditFile);

    if (status) {
        var status = Planning.SyncPreAssessmentWithRiskAnalysis(NewAuditFile);
        var plancatalog = Planning.LoadPlanning(NewAuditFile);
        res.render('toolaudit/toolwork', {
            action: 'audit',
            operation: 'audit_plan',
            AuditErrors: '',
            plancatalog: plancatalog,
            msg: 'Sync with A2.02 matrix (“02 Understanding the IT-systems”) completed!',
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

module.exports = planaudit;