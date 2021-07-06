//npm modules
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
//middleware to validate user controls
const { check, validationResult } = require('express-validator');
//credentials used in the app
var credentials = require('../credentials.js');
var globalvalues = require('../globalvalues.js');
//plugins stats and catalogue
var portfolio = require('../lib/portfolio.js');
//logging system
var log = require('../lib/log.js');
//nlp
var nlp = require('../lib/nlp.js');
//nlp
var Recommendations = require('../lib/auditrec.js');
//audit maps
var AuditMap = require('../lib/auditmap.js');

//generation of uuid
//const uuid = require('uuid/v4');
const { v4: uuid } = require('uuid');
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

const neo4j = require('neo4j-driver');

//const driver = neo4j.driver(credentials.neo4j.uri, neo4j.auth.basic(credentials.neo4j.user,credentials.neo4j.password));

var analyticsportfolio = express.Router();

analyticsportfolio.get('/portfolio',function(req,res){
    var NewAuditFile = credentials.WorkSetPath;
    NewAuditFile = NewAuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(NewAuditFile);
    var status = InitialAudit.VerifyAuditFile(NewAuditFile);
    var user = '';
    try {
        user = req.session.passport.user;
    } catch (error) {
        user ='';
    };

    var weblang ={};
    credentials.WorkLang = req.query.lang.toLowerCase();
    if (req.query.lang=="EN") {
        weblang=globalvalues.weblang.en;
    }else if (req.query.lang=="SQ") {
        weblang=globalvalues.weblang.sq;
    }else if (req.query.lang=="SR") {
        weblang=globalvalues.weblang.sr;
    };

    portfolio.LoadPortfolioOverview(req.query.id, req.query.lang).then(function(Result){
        res.render('toolaudit/portfolioanalytics', {
            //action: req.query.action,
            action: 'audit',
            operation: 'portfolio',
            catalog: Result,
            user: user,
            rectracking: credentials.portfolio,
            audit: status,
            language: req.query.lang,
            webcontent: weblang
        });     
    });
});

analyticsportfolio.get('/audit',function(req,res){
    //res.send('Hello e-gov');
    //res.json(persons);
    var NewAuditFile = credentials.WorkSetPath;
    NewAuditFile = NewAuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(NewAuditFile);
    var status = InitialAudit.VerifyAuditFile(NewAuditFile);
    var user = '';
    try {
        user = req.session.passport.user;
    } catch (error) {
        user ='';
    };

    var weblang ={};
    credentials.WorkLang = req.query.lang.toLowerCase();
    if (req.query.lang=="EN") {
        weblang=globalvalues.weblang.en;
    }else if (req.query.lang=="SQ") {
        weblang=globalvalues.weblang.sq;
    }else if (req.query.lang=="SR") {
        weblang=globalvalues.weblang.sr;
    };
console.log('www');
    //var DataRecommendations = Recommendations.LoadAuditRecommendationsForAnalysis(NewAuditFile);
    portfolio.LoadPortfolioAudit(req.query.id, req.query.auditid, req.query.lang).then(function(Result){
        res.render('toolaudit/portfolioanalytics', {
            //action: req.query.action,
            action: 'audit',
            operation: 'audit',
            data: Result,
            user: user,
            rectracking: credentials.portfolio,
            audit: status,
            language:req.query.lang,
            webcontent: weblang
        });     
    });

});

analyticsportfolio.get('/auditsearch',function(req,res){
    //res.send('Hello e-gov');
    //res.json(persons);
    var NewAuditFile = credentials.WorkSetPath;
    NewAuditFile = NewAuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(NewAuditFile);
    var status = InitialAudit.VerifyAuditFile(NewAuditFile);
    var user = '';
    try {
        user = req.session.passport.user;
    } catch (error) {
        user ='';
    };

    var weblang ={};
    credentials.WorkLang = req.query.lang.toLowerCase();
    if (req.query.lang=="EN") {
        weblang=globalvalues.weblang.en;
    }else if (req.query.lang=="SQ") {
        weblang=globalvalues.weblang.sq;
    }else if (req.query.lang=="SR") {
        weblang=globalvalues.weblang.sr;
    };

    //var DataRecommendations = Recommendations.LoadAuditRecommendationsForAnalysis(NewAuditFile);
    portfolio.LoadSearchAudit(req.query.id, req.query.auditid, req.query.lang).then(function(Result){
        res.render('toolaudit/portfolioanalytics', {
            //action: req.query.action,
            action: 'audit',
            operation: 'audit',
            data: Result,
            user: user,
            rectracking: credentials.portfolio,
            audit: status,
            language:req.query.lang,
            webcontent: weblang
        });     
    });
});

analyticsportfolio.get('/portfoliosearch',function(req,res){
    var NewAuditFile = credentials.WorkSetPath;
    NewAuditFile = NewAuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(NewAuditFile);
    var status = InitialAudit.VerifyAuditFile(NewAuditFile);
    var user = '';
    try {
        user = req.session.passport.user;
    } catch (error) {
        user ='';
    };

    var weblang ={};
    credentials.WorkLang = req.query.lang.toLowerCase();
    if (req.query.lang=="EN") {
        weblang=globalvalues.weblang.en;
    }else if (req.query.lang=="SQ") {
        weblang=globalvalues.weblang.sq;
    }else if (req.query.lang=="SR") {
        weblang=globalvalues.weblang.sr;
    };

    portfolio.SearchPortfolioOverview(req.query.id, req.query.lang).then(function(Result){
        res.render('toolaudit/portfolioanalytics', {
            //action: req.query.action,
            action: 'audit',
            operation: 'portfolio',
            catalog: Result,
            user: user,
            rectracking: credentials.portfolio,
            audit: status,
            language: req.query.lang,
            webcontent: weblang
        });     
    });
});
module.exports = analyticsportfolio;
