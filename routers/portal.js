//npm modules
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
//middleware to validate user controls
const { check, validationResult } = require('express-validator');
//credentials used in the app
var credentials = require('../credentials.js');
//email system
//var emailService = require('../lib/email.js')(credentials);
//plugins stats and catalogue
//var pluginsService = require('../lib/catplugins.js')(credentials.PlugInsPath);
//logging system
var log = require('../lib/log.js');
//portfolios
var portfolio = require('../lib/portfolio.js');
var globalvalues = require('../globalvalues.js');
var colors = require('../colors.js');

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

var portal = express.Router();

portal.get('/rectracking',function(req,res){
    var AuditFile = credentials.WorkSetPath;
    AuditFile = AuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(AuditFile);
    var status = InitialAudit.VerifyAuditFile(AuditFile);
    var LastDate = ''
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

    //console.log(PluginsCatalog.length)
    portfolio.ListPortfolios(user, '1').then(function(Result){
        if (Result.length > 0) {
            LastDate = Result[0].datepub.replace(/T/, ' ').replace(/\.\w*/, '');
        };
        portfolio.LoadColPortfoliosOverview().then(function(ResultStat){
            console.log(colors[0]);
            res.render('portal/rectracking', {
                //action: req.query.action,
                action: req.params.name,
                lastupdate: LastDate,
                catalog: Result,
                catalogStat:ResultStat,
                colors: colors,
                user: user,
                rectracking: credentials.portfolio,
                audit: status, 
                language: req.query.lang,
                webcontent: weblang
            });  
        });
    });
});

portal.get('/search',function(req,res){
    var AuditFile = credentials.WorkSetPath;
    AuditFile = AuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(AuditFile);
    var status = InitialAudit.VerifyAuditFile(AuditFile);
    var LastDate = ''
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

    //console.log(PluginsCatalog.length)
    portfolio.ListPortfolios(user, '1').then(function(Result){
        if (Result.length > 0) {
            LastDate = Result[0].datepub.replace(/T/, ' ').replace(/\.\w*/, '');
        };
        res.render('portal/search', {
            //action: req.query.action,
            action: req.params.name,
            lastupdate: LastDate,
            catalog: Result,
            user: user,
            rectracking: credentials.portfolio,
            audit: status,
            language:req.query.lang,
            webcontent: weblang,
            nodes: globalvalues.NodeAttributes
        });
    });
});

portal.post('/searchresults', function(req, res){
    //check if req.body is filled
    if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
        log.warn('Object req.body missing on search tool');
    } else {
        var user = '';
        try {
            user = req.session.passport.user;
        } catch (error) {
            user ='';
        };
        var SearchExpr = '';
        var weblang ={};
        credentials.WorkLang = req.body.lang.toLowerCase();
        if (req.body.lang=="EN") {
            weblang=globalvalues.weblang.en;
        }else if (req.body.lang=="SQ") {
            weblang=globalvalues.weblang.sq;
        }else if (req.body.lang=="SR") {
            weblang=globalvalues.weblang.sr;
        };

        if (req.body.searchtype==1){
            SearchExpr = req.body.textsearch;
        } else {
            SearchExpr = '\"' + req.body.textsearch + '\"';
        };

        if (req.body.textyear!=''){
            SearchExpr = req.body.textyear;
        // } else {
        //     SearchExpr = SearchExpr +' \"year=\"' + req.body.textyear + '\"\"';
        };

        var totalOptions = req.body.options;
        for ( var i = 1; i < totalOptions; i ++) {
            if (req.body['option'+ i.toString()] != undefined){
                var searchAttribute = portfolio.GetRecommendationSearchAttribute(req.body['option'+ i.toString()].replace(/u0022/g, '\"'), req.body.lang);
                //SearchExpr = SearchExpr +' \"' + req.body['option'+ i.toString()].replace(/u0022/g, '\"') +'\"';
                SearchExpr = SearchExpr +' \"' + searchAttribute +'\"';
                //console.log(SearchExpr)
            };

        }
        
        portfolio.Search(SearchExpr).then(function(Result){
            res.render('portal/searchresults', {
                //action: req.query.action,
                //action: req.params.name,
                //lastupdate: LastDate,
                catalog: Result,
                user: user,
                //rectracking: credentials.portfolio,
                //audit: status,
                language:req.body.lang,
                webcontent: weblang
            });  
        });
    };
});

portal.get('/searchresults/relfindings',function(req,res){
    //console.log(req.query.id + " | " + req.query.auditid + " | " + req.query.recid);
    portfolio.LoadFindingsOfRecommendation(req.query.id, req.query.auditid, req.query.recid).then(function(Result){
        //request parameters:  id, auditid, rec
        //console.log(Result);
        return res.send(Result);
    });
});

module.exports = portal;