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
var Catalog = [];

function LoadFindings(fileid) {
    Catalog = [];

    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    iCounter = 0;
    var vFindings = xpath.select("/Audit/Cases/Case/@nr",doc);
    for (var i=0; i<vFindings.length; i++) {
        var NewEntry = {
            RowId: '#' + String((iCounter+1)),
            Id: vFindings[i].nodeValue,
            Source: xpath.select("/Audit/Cases/Case[@nr='" + vFindings[i].nodeValue + "']/cts/@source",doc)[0].nodeValue,
            Domain: xpath.select("/Audit/Cases/Case[@nr='" + vFindings[i].nodeValue + "']/cts/@domain",doc)[0].nodeValue,
            Area: xpath.select("/Audit/Cases/Case[@nr='" + vFindings[i].nodeValue + "']/cts/@area",doc)[0].nodeValue,
            Issue: xpath.select("/Audit/Cases/Case[@nr='" + vFindings[i].nodeValue + "']/cts/@issue",doc)[0].nodeValue,
            Cause: xpath.select("/Audit/Cases/Case[@nr='" + vFindings[i].nodeValue + "']/@nm",doc)[0].nodeValue,
            Result: xpath.select("/Audit/Cases/Case[@nr='" + vFindings[i].nodeValue + "']/@eff",doc)[0].nodeValue,
            Description: xpath.select("/Audit/Cases/Case[@nr='" + vFindings[i].nodeValue + "']/quote[@type='description']/.",doc)[0].firstChild.nodeValue,
            LegalAct: xpath.select("/Audit/Cases/Case[@nr='" + vFindings[i].nodeValue + "']/@act",doc)[0].nodeValue,
            ReportReference: xpath.select("/Audit/Cases/Case[@nr='" + vFindings[i].nodeValue + "']/@doc",doc)[0].nodeValue,
            Selected: xpath.select("/Audit/Cases/Case[@nr='" + vFindings[i].nodeValue + "']/@Include",doc)[0].nodeValue
        };
        Catalog.push(NewEntry);        
        iCounter++;   
    }
    return Catalog;
};

function SaveFindings(fileid, Catalog) {
    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

   for (let i = 0; i < Catalog.length; i++) {
        var res = xpath.select("/Audit/Cases/Case[@nr='" + Catalog[i].Id + "']/.",doc)
        res[0].setAttribute('Include',Catalog[i].Selected);
    }
    var writetofile = new XMLSerializer().serializeToString(doc);
    fs.writeFileSync(fileid, writetofile);
    return true;
};

function DeleteFinding(fileid, FindingId) {
    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    var res = xpath.select("/Audit/Cases/Case[@nr='" + FindingId + "']/.",doc)
    res[0].parentNode.removeChild(res[0]);

    var writetofile = new XMLSerializer().serializeToString(doc);
    fs.writeFileSync(fileid, writetofile);

    return true;
};

module.exports.LoadFindings = LoadFindings;
module.exports.SaveFindings = SaveFindings;
module.exports.DeleteFinding = DeleteFinding;
