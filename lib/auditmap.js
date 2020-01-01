//credentials used in the app
var credentials = require('../credentials.js');
var globalvalues = require('../globalvalues.js');

var fs = require('fs'),
    path = require('path');

//logging system
var log = require('./log.js');

var xpath   = require('xpath');
var Dom     = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;
var iCounter;
var Catalog = [];

function LoadAuditMap(fileid) {
    return data = JSON.parse(fs.readFileSync(fileid, { encoding : 'UTF-8' }));
};

function GenerateAuditMap(fileid) {
};

module.exports.LoadAuditMap = LoadAuditMap;
module.exports.GenerateAuditMap = GenerateAuditMap;