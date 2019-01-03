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

matricesaudit.get('/planMatrix',function(req,res){
    //res.send('Hello e-gov');
    //res.json(persons);
    var NewAuditFile = credentials.WorkSetPath;
    NewAuditFile = NewAuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(NewAuditFile);
    var status = InitialAudit.VerifyAuditFile(NewAuditFile);

    if (status) {
        var PlanMatrix = Matrices.LoadPlanMatrix(NewAuditFile, req.query.plugin, req.query.domain, req.query.area, req.query.issue);
        res.render('toolaudit/supportmatrix', {
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

matricesaudit.get('/findingMatrix',function(req,res){
    //res.send('Hello e-gov');
    //res.json(persons);
    var NewAuditFile = credentials.WorkSetPath;
    NewAuditFile = NewAuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(NewAuditFile);
    var status = InitialAudit.VerifyAuditFile(NewAuditFile);

    if (status) {
        var FindingMatrix = Matrices.LoadFindingMatrix(NewAuditFile, req.query.id);
        res.render('toolaudit/supportmatrix', {
            action: 'audit',
            operation: 'finding_matrix',
            AuditErrors: '',
            Matrix: FindingMatrix,
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

matricesaudit.get('/preassessMatrix',function(req,res){
    //res.send('Hello e-gov');
    //res.json(persons);
    var NewAuditFile = credentials.WorkSetPath;
    NewAuditFile = NewAuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(NewAuditFile);
    var status = InitialAudit.VerifyAuditFile(NewAuditFile);

    if (status) {
        var preassessMatrix = Matrices.LoadPreAssessMatrix(NewAuditFile, req.query.area, req.query.issue);
        res.render('toolaudit/supportmatrix', {
            action: 'audit',
            operation: 'preassess_matrix',
            AuditErrors: '',
            Matrix: preassessMatrix,
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

matricesaudit.post('/preassessMatrix', function(req, res){
    //old: path.join(__dirname,'work')
    var NewAuditFile = credentials.WorkSetPath;
    NewAuditFile = NewAuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(NewAuditFile);
    var status = InitialAudit.VerifyAuditFile(NewAuditFile);
    
    if (status) {
        //check if req.body is filled
        if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
            log.warn('Object req.body missing on tool audit matrix');
        } else {
            /*
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
            */
        }
    } else {
        res.render('login/login', {
            action: 'login',
            //persons: persons,
            audit: status
        });
    }    
});

matricesaudit.post('/planMatrix', function(req, res){
    //old: path.join(__dirname,'work')
    var NewAuditFile = credentials.WorkSetPath;
    NewAuditFile = NewAuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(NewAuditFile);
    var status = InitialAudit.VerifyAuditFile(NewAuditFile);
    
    if (status) {
        //check if req.body is filled
        if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
            log.warn('Object req.body missing on tool audit matrix');
        } else {
            var Catalog = {
                PluginId: req.body.plugin,
                DomainId: req.body.domain,
                AreaId: req.body.area,
                IssueId: req.body.issue,
                Objectives: req.body.objectives,
                Criteria: req.body.criteria,
                Inforequired: req.body.inforequired,
                Method: req.body.method,
                Found: req.body.foundpreviously,
                Conclusion: req.body.conclusion
            };
            //save plugins selected for audit
            var status = Matrices.SavePlanMatrix(NewAuditFile, Catalog);
            var PlanMatrix = Matrices.LoadPlanMatrix(NewAuditFile, Catalog.PluginId, Catalog.DomainId, Catalog.AreaId, Catalog.IssueId);
            res.render('toolaudit/supportmatrix', {
                action: 'audit',
                operation: 'plan_matrix',
                AuditErrors: '',
                Matrix: PlanMatrix,
                msg: '',
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

matricesaudit.post('/findingMatrix', function(req, res){
    //old: path.join(__dirname,'work')
    var NewAuditFile = credentials.WorkSetPath;
    NewAuditFile = NewAuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(NewAuditFile);
    var status = InitialAudit.VerifyAuditFile(NewAuditFile);
    
    if (status) {
        //check if req.body is filled
        if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
            log.warn('Object req.body missing on tool audit matrix');
        } else {
            var vItems = req.body.issue.split("_");
            var Catalog = {
                FindingId: req.body.findingid,
                Source: req.body.source,
                Domain: vItems[1],
                Area: vItems[2],
                Issue: vItems[3],
                Cause: req.body.cause,
                Result: req.body.result,
                Description: req.body.description,
                Recommendation: req.body.recommendation,
                LegalAct: req.body.legalact,
                ReportReference: req.body.report
            };
            //save plugins selected for audit
            var RefId = Matrices.SaveFindingMatrix(NewAuditFile, Catalog);
            if (RefId.substring(0, 1) == 'F') {
                var FindingMatrix = Matrices.LoadFindingMatrix(NewAuditFile, RefId);
                res.render('toolaudit/supportmatrix', {
                    action: 'audit',
                    operation: 'finding_matrix',
                    AuditErrors: '',
                    Matrix: FindingMatrix,
                    msg: '',
                    audit: 'true'
                 });                    
            }
        }
    } else {
        res.render('login/login', {
            action: 'login',
            //persons: persons,
            audit: status
        });
    }    
});

module.exports = matricesaudit;