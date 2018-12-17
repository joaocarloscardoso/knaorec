//credentials used in the app
var credentials = require('../credentials.js');

var fs = require('fs'),
    path = require('path');

//logging system
var log = require('./log.js');

var xpath   = require('xpath');
var Dom     = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;
var iCounter;

function LoadPlanMatrix(fileid, DomainId, AreaId, IssueId) {
    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    var NewEntry = {
        DomainId: DomainId,
        AreaId: AreaId,
        IssueId: IssueId,
        Domain: '',
        Area: '',
        Issue: '',
        Objectives: '',
        Criteria: '',
        Inforequired: '',
        Method: '',
        Found: '',
        Conclusion: ''
    };

    return NewEntry;
};

module.exports.LoadPlanMatrix = LoadPlanMatrix;