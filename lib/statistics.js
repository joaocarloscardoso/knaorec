//credentials used in the app
var credentials = require('../credentials.js');

var fs = require('fs'),
    path = require('path');

//logging system
var log = require('./log.js');
//credentials used in the app
var credentials = require('../credentials.js');

var xpath   = require('xpath');
var Dom     = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;
var iCounter;

function GeneralDomainCharacterization(fileid) {
    var data='';
    return data;
};

function GeneralRiskCharacterization(fileid) {
    var data='';
    return data;
};

function SpecificDomainCharacterization(fileid, DomainId) {
    var data='';
    return data;
};

module.exports.GeneralDomainCharacterization = GeneralDomainCharacterization;
module.exports.GeneralRiskCharacterization = GeneralRiskCharacterization;
module.exports.SpecificDomainCharacterization = SpecificDomainCharacterization;