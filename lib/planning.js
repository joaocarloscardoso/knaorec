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
var Catalog = [];

function MergePlugInData(doc, vPointerDomain) {

    var vAreas = xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area/@nr",doc);
    for (var j=0; j<vAreas.length; j++) {
        var vPointerArea=vAreas[j].nodeValue;
 
        var vDescrDomain= vPointerDomain + ' - ' + xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
        var PluginId = xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/../../@id",doc)[0].nodeValue;

        var vDescrArea=vPointerArea + ' - (' + PluginId + ') ' + xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
        var vIssues = xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue/@nr",doc);
        for (var k=0; k<vIssues.length; k++) {

            var NewEntry = {
                RowId: '#' + String((iCounter+1)),
                PluginId: PluginId,
                Domain: vDescrDomain,
                DomainId: vPointerDomain,
                Area: vDescrArea,
                AreaId: vPointerArea,
                Issue: vIssues[k].nodeValue + ' - '  + xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue,
                IssueId: vIssues[k].nodeValue,
                Risk: xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/@RiskWeight",doc)[0].nodeValue,
                Selected: xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/@Include",doc)[0].nodeValue,
                Remarks: xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/@Remarks",doc)[0].nodeValue
            };
            Catalog.push(NewEntry);        
            iCounter++;   
        }         
    }
};

function LoadPlanning(fileid) {
    Catalog = [];

    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    var vPointerDomain='';
    var vDescrDomain='';
    iCounter = 0;
    var vDomains = xpath.select("/Audit/ActiveITAuditDomains/Domain/@nr",doc);
    for (var i=0; i<vDomains.length; i++) {
        if (vPointerDomain != vDomains[i].nodeValue) {
            if (vPointerDomain != '') {
                //call method to get plugins data
                MergePlugInData(doc, vPointerDomain);
            }
            vPointerDomain = vDomains[i].nodeValue;
            vDescrDomain= vPointerDomain + ' - ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
        }

        var vAreas = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/Area/@nr",doc);
        for (var j=0; j<vAreas.length; j++) {
            var vPointerArea=vAreas[j].nodeValue;
            var vDescrArea=vPointerArea + ' - ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;

            var vIssues = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue/@nr",doc);
            for (var k=0; k<vIssues.length; k++) {

                var NewEntry = {
                    RowId: '#' + String((iCounter+1)),
                    PluginId: 'CORE',
                    Domain: vDescrDomain,
                    DomainId: vPointerDomain,
                    Area: vDescrArea,
                    AreaId: vPointerArea,
                    Issue: vIssues[k].nodeValue + ' - '  + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue,
                    IssueId: vIssues[k].nodeValue,
                    Risk: xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/@RiskWeight",doc)[0].nodeValue,
                    Selected: xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/@Include",doc)[0].nodeValue,
                    Remarks: xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/@Remarks",doc)[0].nodeValue
                };
                Catalog.push(NewEntry);        
                iCounter++;   
            }         
        }
    }
    //final call method to get plugins data (if not is going to ignore last domain)
    MergePlugInData(doc, vPointerDomain);
    return Catalog;
};

function SavePlanning(fileid, Catalog) {
    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    for (let i = 0; i < Catalog.length; i++) {
        if (Catalog[i].PluginId == 'CORE'){
            var res = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + Catalog[i].DomainId + "']/Area[@nr='" + Catalog[i].AreaId + "']/Issue[@nr='" + Catalog[i].IssueId + "']/.",doc)
            res[0].setAttribute('RiskWeight',Catalog[i].Risk);
            res[0].setAttribute('Include',Catalog[i].Selected);
            res[0].setAttribute('Remarks',Catalog[i].Remarks);
        } else {
            var res = xpath.select("/Audit/PlugIns/PlugIn[@id='" + Catalog[i].PluginId + "']/Domain[@nr='" + Catalog[i].DomainId + "']/Area[@nr='" + Catalog[i].AreaId + "']/Issue[@nr='" + Catalog[i].IssueId + "']/.",doc)
            res[0].setAttribute('RiskWeight',Catalog[i].Risk);
            res[0].setAttribute('Include',Catalog[i].Selected);
            res[0].setAttribute('Remarks',Catalog[i].Remarks);
        }
    }
    var writetofile = new XMLSerializer().serializeToString(doc);
    fs.writeFileSync(fileid, writetofile);
    return true;
};

module.exports.LoadPlanning = LoadPlanning;
module.exports.SavePlanning = SavePlanning;