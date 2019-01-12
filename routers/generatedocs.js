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
var Docs = require('../lib/docgeneration.js');
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
//report generation template engine
const carbone = require('carbone');

var generatedocs = express.Router();

generatedocs.get('/docplanMatrix',function(req,res){
    //res.send('Hello e-gov');
    //res.json(persons);
    var NewAuditFile = credentials.WorkSetPath;
    NewAuditFile = NewAuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(NewAuditFile);
    var status = InitialAudit.VerifyAuditFile(NewAuditFile);

    var NewDocFile = credentials.WorkSetPath;
    NewDocFile = NewDocFile + req.sessionID + '.odt';

    if (status) {
        var data = Matrices.LoadPlanMatrix(NewAuditFile, req.query.plugin, req.query.domain, req.query.area, req.query.issue);
        carbone.render('./public/templates/PlanMatrix.odt', data, function(err, result){
            if (err) {
              return log.info('document (plan matrix) generation error:  ' +err);
            }
            // write the result
            fs.writeFileSync(NewDocFile, result);
            res.redirect('/document/work/' + req.sessionID + '.odt');
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

generatedocs.get('/docfindingMatrix',function(req,res){
    //res.send('Hello e-gov');
    //res.json(persons);
    var NewAuditFile = credentials.WorkSetPath;
    NewAuditFile = NewAuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(NewAuditFile);
    var status = InitialAudit.VerifyAuditFile(NewAuditFile);

    var NewDocFile = credentials.WorkSetPath;
    NewDocFile = NewDocFile + req.sessionID + '.odt';

    if (status) {
        var data = Matrices.LoadFindingMatrix(NewAuditFile, req.query.id);
        carbone.render('./public/templates/FindingMatrix.odt', data, function(err, result){
            if (err) {
              return log.info('document (finding matrix) generation error:  ' +err);
            }
            // write the result
            fs.writeFileSync(NewDocFile, result);
            res.redirect('/document/work/' + req.sessionID + '.odt');
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

generatedocs.get('/docauditprogramme',function(req,res){
    //res.send('Hello e-gov');
    //res.json(persons);
    var NewAuditFile = credentials.WorkSetPath;
    NewAuditFile = NewAuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(NewAuditFile);
    var status = InitialAudit.VerifyAuditFile(NewAuditFile);

    var NewDocFile = credentials.WorkSetPath;
    NewDocFile = NewDocFile + req.sessionID + '.odt';

    if (status) {
        var data = Docs.LoadAuditProgramme(NewAuditFile);
        carbone.render('./public/templates/AuditProgramme.odt', data, function(err, result){
            if (err) {
              return log.info('document (Audit Programme) generation error:  ' +err);
            }
            // write the result
            fs.writeFileSync(NewDocFile, result);
            res.redirect('/document/work/' + req.sessionID + '.odt');
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

generatedocs.get('/docexecutivesummary',function(req,res){
    //res.send('Hello e-gov');
    //res.json(persons);
    var NewAuditFile = credentials.WorkSetPath;
    NewAuditFile = NewAuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(NewAuditFile);
    var status = InitialAudit.VerifyAuditFile(NewAuditFile);

    var NewDocFile = credentials.WorkSetPath;
    NewDocFile = NewDocFile + req.sessionID + '.odt';

    if (status) {
        var data = Docs.LoadExecutiveSummary(NewAuditFile);
        carbone.render('./public/templates/AuditExecutiveSummary.odt', data, function(err, result){
            if (err) {
              return log.info('document (Executive Summary) generation error:  ' +err);
            }
            // write the result
            fs.writeFileSync(NewDocFile, result);
            res.redirect('/document/work/' + req.sessionID + '.odt');
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

module.exports = generatedocs;