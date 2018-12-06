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

function LoadPlanning(fileid) {
    var Catalog = [];

    var i=0;

    var NewEntry = {
        RowId: '#' + String((i+1)),
        PluginId: 'CORE',
        Domain: '01 - Test domain',
        DomainId: '01',
        Area: '01 - Test area',
        AreaId: '01',
        Issue: '01 - Test issue 1',
        IssueId: '01',
        Risk:'3',
        Selected: 'Yes',
        Remarks:''
    };

    Catalog.push(NewEntry);                    

    i++;
    var NewEntry = {
        RowId: '#' + String((i+1)),
        PluginId: 'CORE',
        Domain: '01 - Test domain',
        DomainId: '01',
        Area: '01 - Test area',
        AreaId: '01',
        Issue: '02 - Test issue 2',
        IssueId: '02',
        Risk:'1',
        Selected: 'No',
        Remarks:''
    };

    Catalog.push(NewEntry);                    
    return Catalog;
};

module.exports.LoadPlanning = LoadPlanning;
