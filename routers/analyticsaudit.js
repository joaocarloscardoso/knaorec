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

const neo4j = require('neo4j-driver').v1;

const driver = neo4j.driver(credentials.neo4j.uri, neo4j.auth.basic(credentials.neo4j.user,credentials.neo4j.password));

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

analyticsaudit.post('/Recommendations',function(req,res){
    //res.send('Hello e-gov');
    //res.json(persons);
    var NewAuditFile = credentials.WorkSetPath;
    NewAuditFile = NewAuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(NewAuditFile);
    var status = InitialAudit.VerifyAuditFile(NewAuditFile);

    if (status) {
        var VectorFile = credentials.WorkSetPath;
        VectorFile = VectorFile + req.sessionID + '.vec';
        //var CypherQuery = nlp.GetCypherQuery(VectorFile);
        var CypherTableQuery = nlp.GetTableQuery(VectorFile);

        const session = driver.session();

        session
            .run(CypherTableQuery)
            .then(result => {
                var NodeResults = [];
                result.records.forEach(function(record){
                    //create object to featurize collection (unique audits, with urls and relations)
                    //order them by number of relations desc
                    //var UniqueNodes = [];
                    if (NodeResults.some( Node => Node.Id === record._fields[1].identity.low)) {
                        NodeResults.find( Node => Node.Id === record._fields[1].identity.low).Number = NodeResults.find( Node => Node.Id === record._fields[1].identity.low).Number + 1;
                        NodeResults.find( Node => Node.Id === record._fields[1].identity.low).Relation = NodeResults.find( Node => Node.Id === record._fields[1].identity.low).Relation + '; ' + record._fields[0].properties.Definition;
                    } else {
                        //nodeid= nodeid.replace('Integer { "low: ','').replace(', high: 0 }','');
                        var objElement = {
                            Id: record._fields[1].identity.low,
                            Relation:record._fields[0].properties.Definition,
                            Name: record._fields[1].properties.Title,
                            Url: record._fields[1].properties.URL,
                            Author: record._fields[1].properties.Author,
                            Year: record._fields[1].properties.Year,
                            Number:1
                        };
                        // console.log(objElement);
                        NodeResults.push(objElement);
                    }
                });
                //console.log(NodeResults.sort(nlp.sort_by('Number', true, parseFloat)));
                var CypherQuery = nlp.GetCypherQuery(VectorFile);
                res.render('toolaudit/analyticsvis', {
                    action: 'audit',
                    operation: 'recommendationvis',
                    AuditErrors: '',
                    ServerUrl: credentials.neo4j.uri,
                    ServerUser: credentials.neo4j.user,
                    ServerPassword: credentials.neo4j.password,
                    InitialCypher: CypherQuery,
                    DataTable: NodeResults.sort(nlp.sort_by('Number', true, parseFloat)),
                    msg: '',
                    auditfile: 'work/' + req.sessionID + '.xml',
                    audit: status
                 });        
                session.close();  
            })
            .catch(error => {
                log.warn('Graph db error: ' + error);
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