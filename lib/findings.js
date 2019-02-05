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

function FindingsForGeneralDomainsAnalysis(fileid) {
    var Catalog = {
        wNumber: '',
        wRelevant: '',
        wTreshold:''
    };
    //data about findings number on 7 core domains
    var WeightNumber   = [0,0,0,0,0,0,0];
    //data about relevant findings on 7 core domains
    var WeightRelevant = [0,0,0,0,0,0,0];
    //threshold on 7 core domains
    var WeightTreshold = [0,0,0,0,0,0,0];


    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    var vDomains = xpath.select("/Audit/Cases/Case/@nr",doc);
    for (var i=0; i<vDomains.length; i++) {
        var vDomain = xpath.select("/Audit/Cases/Case[@nr='" + vDomains[i].nodeValue + "']/cts/@domain",doc)[0].nodeValue.substring(0, 2)
        var vInclude =xpath.select("/Audit/Cases/Case[@nr='" + vDomains[i].nodeValue + "']/@Include",doc)[0].nodeValue;

        WeightNumber[(parseInt(vDomain)-1)] = parseInt(WeightNumber[(parseInt(vDomain)-1)]) + 1;
        WeightTreshold[(parseInt(vDomain)-1)] = parseInt(WeightTreshold[(parseInt(vDomain)-1)]) + 1;
        if (vInclude=="Yes"){
            WeightRelevant[(parseInt(vDomain)-1)] = parseInt(WeightRelevant[(parseInt(vDomain)-1)]) +1;
        }
    }

    for (var j = 0; j < WeightTreshold.length; j++){
        if (WeightTreshold[j]==0){
            WeightTreshold[j]=1;
        }
        
    }
    Catalog.wNumber = WeightNumber.join();
    Catalog.wRelevant = WeightRelevant.join();
    Catalog.wTreshold = WeightTreshold.join();
    console.log(Catalog);
    return Catalog;
};


function LoadFindingsAnalysis(fileid) {
    Catalog = [];

    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    iCounter = 0;
    var vFindings = xpath.select("/Audit/Cases/Case/@nr",doc);
    for (var i=0; i<vFindings.length; i++) {
        if (
        Catalog.some(Node => 
            Node.Source === xpath.select("/Audit/Cases/Case[@nr='" + vFindings[i].nodeValue + "']/cts/@source",doc)[0].nodeValue
            &&
            Node.Domain === xpath.select("/Audit/Cases/Case[@nr='" + vFindings[i].nodeValue + "']/cts/@domain",doc)[0].nodeValue
            &&
            Node.Area === xpath.select("/Audit/Cases/Case[@nr='" + vFindings[i].nodeValue + "']/cts/@area",doc)[0].nodeValue
            &&
            Node.Issue === xpath.select("/Audit/Cases/Case[@nr='" + vFindings[i].nodeValue + "']/cts/@issue",doc)[0].nodeValue
        )) {
            Catalog.find(Node => 
                Node.Source === xpath.select("/Audit/Cases/Case[@nr='" + vFindings[i].nodeValue + "']/cts/@source",doc)[0].nodeValue
                &&
                Node.Domain === xpath.select("/Audit/Cases/Case[@nr='" + vFindings[i].nodeValue + "']/cts/@domain",doc)[0].nodeValue
                &&
                Node.Area === xpath.select("/Audit/Cases/Case[@nr='" + vFindings[i].nodeValue + "']/cts/@area",doc)[0].nodeValue
                &&
                Node.Issue === xpath.select("/Audit/Cases/Case[@nr='" + vFindings[i].nodeValue + "']/cts/@issue",doc)[0].nodeValue
            ).Number = Catalog.find( Node => 
                Node.Source === xpath.select("/Audit/Cases/Case[@nr='" + vFindings[i].nodeValue + "']/cts/@source",doc)[0].nodeValue
                &&
                Node.Domain === xpath.select("/Audit/Cases/Case[@nr='" + vFindings[i].nodeValue + "']/cts/@domain",doc)[0].nodeValue
                &&
                Node.Area === xpath.select("/Audit/Cases/Case[@nr='" + vFindings[i].nodeValue + "']/cts/@area",doc)[0].nodeValue
                &&
                Node.Issue === xpath.select("/Audit/Cases/Case[@nr='" + vFindings[i].nodeValue + "']/cts/@issue",doc)[0].nodeValue
            ).Number + 1;
        } else {
            var NewEntry = {
                Source: xpath.select("/Audit/Cases/Case[@nr='" + vFindings[i].nodeValue + "']/cts/@source",doc)[0].nodeValue,
                Domain: xpath.select("/Audit/Cases/Case[@nr='" + vFindings[i].nodeValue + "']/cts/@domain",doc)[0].nodeValue,
                Area: xpath.select("/Audit/Cases/Case[@nr='" + vFindings[i].nodeValue + "']/cts/@area",doc)[0].nodeValue,
                Issue: xpath.select("/Audit/Cases/Case[@nr='" + vFindings[i].nodeValue + "']/cts/@issue",doc)[0].nodeValue,
                Number: 1
            };
            Catalog.push(NewEntry);   
        }     
        iCounter++;   
    }
    return Catalog;
};

module.exports.LoadFindings = LoadFindings;
module.exports.SaveFindings = SaveFindings;
module.exports.DeleteFinding = DeleteFinding;
module.exports.LoadFindingsAnalysis = LoadFindingsAnalysis;
module.exports.FindingsForGeneralDomainsAnalysis = FindingsForGeneralDomainsAnalysis;
