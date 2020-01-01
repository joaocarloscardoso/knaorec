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
var Nodes = [];
var KeyNodes = [];
var Edges = [];
var Support = [];

function LoadAuditMap(fileid) {
    return data = JSON.parse(fs.readFileSync(fileid, { encoding : 'UTF-8' }));
};

function GetPlanObjects(fileid){
    var vDomainTitle = '';
    var vDomainDescription = '';
    var vCurrentDomainId = 0;
    var vAreaTitle = '';
    var vAreaDescription = '';
    var vCurrentAreaId = 0;
    var vIssueTitle = '';
    var vIssueDescription = '';
    var vCurrentIssueId = 0;
    var vIssue = '';

    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    var vDomains = xpath.select("/Audit/ActiveITAuditDomains/Domain/@nr",doc);
    for (var i=0; i<vDomains.length; i++) {
        var vAreas = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vDomains[i].nodeValue + "']/Area/@nr",doc);
        for (var j=0; j<vAreas.length; j++) {
            var vItems = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vAreas[j].nodeValue + "']/Issue/@nr",doc);
            for (var m=0; m<vItems.length; m++) {
                var vIncluded =  xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vAreas[j].nodeValue + "']/Issue[@nr='" + vItems[m].nodeValue + "']/@Include",doc)[0].nodeValue;
                if (vIncluded == "Yes"){ 
                    vDomainTitle = vDomains[i].nodeValue + ' ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vDomains[i].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
                    var res = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vDomains[i].nodeValue + "']/Narrative/narr[@l='" + credentials.WorkLang + "']/ak",doc);
                    if (res.length==1 && res[0].firstChild != null){
                        vDomainDescription=res[0].firstChild.nodeValue;
                    } else {
                        vDomainDescription="No description available";
                    }
                    vAreaTitle = vAreas[j].nodeValue + ' ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vAreas[j].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue                   
                    res = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vAreas[j].nodeValue + "']/Narrative/narr[@l='" + credentials.WorkLang + "']/ak",doc);
                    if (res.length==1 && res[0].firstChild != null){
                        vAreaDescription=res[0].firstChild.nodeValue;
                    } else {
                        vAreaDescription="No description available";
                    }
                    vIssueTitle = vItems[m].nodeValue + ' ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vAreas[j].nodeValue + "']/Issue[@nr='" + vItems[m].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
                    res = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vAreas[j].nodeValue + "']/Issue[@nr='" + vItems[m].nodeValue + "']/Narrative/narr[@l='" + credentials.WorkLang + "']/ak",doc);
                    if (res.length==1 && res[0].firstChild != null){
                        vIssueDescription=res[0].firstChild.nodeValue;
                    } else {
                        vIssueDescription="No description available";
                    }    
                    vIssue = 'AITAM_' + vDomains[i].nodeValue + '_' + vAreas[j].nodeValue + '_' + vItems[m].nodeValue;
                    //create issue and get id number
                    var NewNodeEntry = {
                        id: Nodes.length,
                        label: 'Issue:\n' + vIssueTitle,
                        title: 'Issue: ' + vIssueTitle,
                        group: 1
                    };
                    vCurrentIssueId = NewNodeEntry.id;
                    Nodes.push(NewNodeEntry);     

                    var NewSupportEntry = {
                        title: 'Issue: ' + vIssueTitle,
                        matrix: '/auditMatrices/planMatrix?plugin=CORE&domain=' + vDomains[i].nodeValue + '&area=' + vAreas[j].nodeValue + '&issue=' + vItems[m].nodeValue + '&src=map',
                        description: vIssueDescription
                    };
                    Support.push(NewSupportEntry);        
                    
                    var NewKeyEntry = {
                        id: vCurrentIssueId,
                        nodekey: vIssue
                    };
                    KeyNodes.push(NewKeyEntry);        
                    //find if area exists and:
                    //a) if not create and get id number
                    //b) else find area id number
                    //relates edge of issue id with area id
                    //find if domain exists and:
                    //a) if not create and get id number
                    //b) else find domain id number
                    //relates edge of area id with domain id
                    //relates edge of domain id with audit id
                }
            }
        }
    }

    var vPlugins = xpath.select("/Audit/PlugIns/PlugIn/@id",doc);
    for (var k=0; k<vPlugins.length; k++) {
        var vDomains = xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain/@nr",doc);
        for (var i=0; i<vDomains.length; i++) {
            var vAreas = xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain[@nr='" + vDomains[i].nodeValue + "']/Area/@nr",doc);
            for (var j=0; j<vAreas.length; j++) {
                var vItems = xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vAreas[j].nodeValue + "']/Issue/@nr",doc);
                for (var m=0; m<vItems.length; m++) {
                    var vIncluded =  xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vAreas[j].nodeValue + "']/Issue[@nr='" + vItems[m].nodeValue + "']/@Include",doc)[0].nodeValue;
                    if (vIncluded == "Yes"){ 
                        vDomainTitle = vDomains[i].nodeValue + ' ' + xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain[@nr='" + vDomains[i].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
                        var res = xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain[@nr='" + vDomains[i].nodeValue + "']/Narrative/narr[@l='" + credentials.WorkLang + "']/ak",doc);
                        if (res.length==1 && res[0].firstChild != null){
                            vDomainDescription=res[0].firstChild.nodeValue;
                        } else {
                            vDomainDescription="No description available";
                        }
                        vAreaTitle = vAreas[j].nodeValue + ' ' + xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vAreas[j].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue                   
                        res = xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vAreas[j].nodeValue + "']/Narrative/narr[@l='" + credentials.WorkLang + "']/ak",doc);
                        if (res.length==1 && res[0].firstChild != null){
                            vAreaDescription=res[0].firstChild.nodeValue;
                        } else {
                            vAreaDescription="No data available";
                        }
                        vIssueTitle = vItems[m].nodeValue + ' ' + xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vAreas[j].nodeValue + "']/Issue[@nr='" + vItems[m].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
                        res = xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vAreas[j].nodeValue + "']/Issue[@nr='" + vItems[m].nodeValue + "']/Narrative/narr[@l='" + credentials.WorkLang + "']/ak",doc);
                        if (res.length==1 && res[0].firstChild != null){
                            vIssueDescription=res[0].firstChild.nodeValue;
                        } else {
                            vIssueDescription="No description available";
                        }    
                        vIssue = vPlugins[k].nodeValue + '_' + vDomains[i].nodeValue + '_' + vAreas[j].nodeValue + '_' + vItems[m].nodeValue;
                        //create issue and get id number
                        var NewNodeEntry = {
                            id: Nodes.length,
                            label: 'Issue:\n' + vIssueTitle,
                            title: 'Issue: ' + vIssueTitle,
                            group: 1
                        };
                        vCurrentIssueId = NewNodeEntry.id;
                        Nodes.push(NewNodeEntry);     
    
                        var NewSupportEntry = {
                            title: 'Issue: ' + vIssueTitle,
                            matrix: '/auditMatrices/planMatrix?plugin=' + vPlugins[k].nodeValue + '&domain=' + vDomains[i].nodeValue + '&area=' + vAreas[j].nodeValue + '&issue=' + vItems[m].nodeValue + '&src=map',
                            description: vIssueDescription
                        };
                        Support.push(NewSupportEntry);        
                        
                        var NewKeyEntry = {
                            id: vCurrentIssueId,
                            nodekey: vIssue
                        };
                        KeyNodes.push(NewKeyEntry);        
                        //find if area exists and:
                        //a) if not create and get id number
                        //b) else find area id number
                        //relates edge of issue id with area id
                        //find if domain exists and:
                        //a) if not create and get id number
                        //b) else find domain id number
                        //relates edge of area id with domain id
                        //relates edge of domain id with audit id
                    }
                }
            }
        }
    }
};


function GenerateAuditMap(fileid) {
    Catalog = [];
    Nodes = [];
    KeyNodes = [];
    Edges = [];
    Support = [];

    GetPlanObjects(fileid);
    //GetFindingObjects(fileid);
    //GetRecommendationObjects(fileid);
};

module.exports.LoadAuditMap = LoadAuditMap;
module.exports.GenerateAuditMap = GenerateAuditMap;