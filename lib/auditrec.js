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

function LoadAuditRecommendations(fileid) {
    Catalog = [];
    tempDescription = '';
    tempTimeline ='';
    tempStatus='';

    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    iCounter = 0;
    var vRecommendations = xpath.select("/Audit/Recommendations/Recommendation/@nr",doc);

    for (var i=0; i<vRecommendations.length; i++) {
        if (xpath.select("/Audit/Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/quote[@type='description']/.",doc)[0].firstChild === null)
        {
            tempDescription= '';
        }else{
            tempDescription= xpath.select("/Audit/Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/quote[@type='description']/.",doc)[0].firstChild.nodeValue;
        };
        if (xpath.select("/Audit/Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/quote[@type='timeline']/.",doc)[0].firstChild === null)
        {
            tempTimeline= '';
        }else{
            tempTimeline= xpath.select("/Audit/Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/quote[@type='timeline']/.",doc)[0].firstChild.nodeValue;
        };

        var vMonitoring = xpath.select("/Audit/Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/monitoring/assessment/@date",doc);
        if (vMonitoring.length > 0) {
            tempStatus=xpath.select("/Audit/Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/monitoring/assessment[@date='" + vMonitoring[(vMonitoring.length-1)].nodeValue + "']/@status",doc)[0].nodeValue;
        } else {
            tempStatus='(not yet accessed))';
        };

        var NewEntry = {
            RowId: '#' + String((iCounter+1)),
            Id: vRecommendations[i].nodeValue,
            Description: tempDescription,
            Priority: xpath.select("/Audit/Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@priority",doc)[0].nodeValue,
            Risk: xpath.select("/Audit/Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@risk",doc)[0].nodeValue,
            Riskevaluation: xpath.select("/Audit/Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@riskevaluation",doc)[0].nodeValue,
            Timeline: tempTimeline,
            Status: tempStatus
        };
        Catalog.push(NewEntry);        
        iCounter++;   
    }
    return Catalog;
};

function DeleteAuditRecommendation(fileid, AuditRecId) {
    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    var res = xpath.select("/Audit/Recommendations/Recommendation[@nr='" + AuditRecId + "']/.",doc)
    res[0].parentNode.removeChild(res[0]);

    var writetofile = new XMLSerializer().serializeToString(doc);
    fs.writeFileSync(fileid, writetofile);

    return true;
};

module.exports.LoadAuditRecommendations = LoadAuditRecommendations;
module.exports.DeleteAuditRecommendation = DeleteAuditRecommendation;
