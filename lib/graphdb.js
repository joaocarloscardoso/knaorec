//credentials used in the app
var credentials = require('../credentials.js');

var fs = require('fs'),
    path = require('path');

//logging system
var log = require('./log.js');

const neo4j = require('neo4j-driver').v1;

const driver = neo4j.driver(credentials.neo4j.uri, neo4j.auth.basic(credentials.neo4j.user,credentials.neo4j.password));

function CreateDictionary() {
    var NewDictFile = credentials.WorkSetPath;
    NewDictFile = NewDictFile + 'gazetteer.dic';

    const session = driver.session();
    session
        .run('MATCH (n:Country) RETURN n')
        .then(result => {
            fs.writeFileSync(NewDictFile, '');
                result.records.forEach(function(record){
                fs.appendFileSync(NewDictFile, record._fields[0].properties.Name +'|Country|0\n');
               // console.log(record._fields[0].properties.Name);
            });
        })
        .catch(error => {
            log.warn('Graph db error: ' + error);
        });
    session.close();

    session
        .run('MATCH (n:Function) RETURN n')
        .then(result => {
            result.records.forEach(function(record){
                fs.appendFileSync(NewDictFile, record._fields[0].properties.Definition +'|Function|0\n');
               // console.log(record._fields[0].properties.Name);
            });
        })
        .catch(error => {
            log.warn('Graph db error: ' + error);
        });
    session.close();

    session
        .run('MATCH (n:ActivityDomain) RETURN n')
        .then(result => {
            result.records.forEach(function(record){
                fs.appendFileSync(NewDictFile, record._fields[0].properties.Definition +'|ActivityDomain|0\n');
               // console.log(record._fields[0].properties.Name);
            });
        })
        .catch(error => {
            log.warn('Graph db error: ' + error);
        });
    session.close();

    session
        .run('MATCH (n:Process) RETURN n')
        .then(result => {
            result.records.forEach(function(record){
                fs.appendFileSync(NewDictFile, record._fields[0].properties.Definition +'|Process|0\n');
            // console.log(record._fields[0].properties.Name);
            });
        })
        .catch(error => {
            log.warn('Graph db error: ' + error);
        });
    session.close();

    session
        .run('MATCH (n:Goal) RETURN n')
        .then(result => {
            result.records.forEach(function(record){
                fs.appendFileSync(NewDictFile, record._fields[0].properties.Definition +'|Goal|0\n');
            // console.log(record._fields[0].properties.Name);
            });
        })
        .catch(error => {
            log.warn('Graph db error: ' + error);
        });
    session.close();

    session
        .run('MATCH (n:Topics) RETURN n')
        .then(result => {
            result.records.forEach(function(record){
                fs.appendFileSync(NewDictFile, record._fields[0].properties.Definition +'|Topics|0\n');
            // console.log(record._fields[0].properties.Name);
            });
        })
        .catch(error => {
            log.warn('Graph db error: ' + error);
        });
    session.close();
};

module.exports.CreateDictionary = CreateDictionary;
