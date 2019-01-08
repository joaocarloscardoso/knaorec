//credentials used in the app
var credentials = require('../credentials.js');

var fs = require('fs'),
    path = require('path');

//logging system
var log = require('./log.js');

var xpath   = require('xpath');
var Dom     = require('xmldom').DOMParser;
var iCounter;

function MergePlugInData(doc, vPointerDomain) {
    var vTipDomain='';
    var vTipArea='';
    var vTipIssue='';

    var vAreas = xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area/@nr",doc);
    for (var j=0; j<vAreas.length; j++) {
        var vPointerArea=vAreas[j].nodeValue;
 
        var vDescrDomain= vPointerDomain + ' - ' + xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
        var PluginId = xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/../../@id",doc)[0].nodeValue;

        var res=xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Narrative/narr[@l='" + credentials.WorkLang + "']/ak",doc);
        if (res.length==1 && res[0].firstChild != null){
            vTipDomain=res[0].firstChild.nodeValue;
        } else {
            vTipDomain="No data available";
        }

        var vDescrArea=vPointerArea + ' - (' + PluginId + ') ' + xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
        res=xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Narrative/narr[@l='" + credentials.WorkLang + "']/ak",doc);
        if (res.length==1 && res[0].firstChild != null){
            vTipArea=res[0].firstChild.nodeValue;
        } else {
            vTipArea="No data available";
        }

        var vIssues = xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue/@nr",doc);
        for (var k=0; k<vIssues.length; k++) {

            var res=xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/Narrative/narr[@l='" + credentials.WorkLang + "']/ak",doc);
            if (res.length==1 && res[0].firstChild != null){
                vTipIssue=res[0].firstChild.nodeValue;
            } else {
                vTipIssue="No data available";
            }    

            var NewEntry = {
                RowId: '#' + String((iCounter+1)),
                PluginId: PluginId,
                Domain: vDescrDomain,
                DomainId: vPointerDomain,
                DomainTip: vTipDomain,
                Area: vDescrArea,
                AreaId: vPointerArea,
                AreaTip: vTipArea,
                Issue: vIssues[k].nodeValue + ' - '  + xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue,
                IssueId: vIssues[k].nodeValue,
                IssueTip: vTipIssue,
                Risk: xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/@RiskWeight",doc)[0].nodeValue,
                Selected: xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/@Include",doc)[0].nodeValue,
                Remarks: xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/@Remarks",doc)[0].nodeValue
            };
            Catalog.push(NewEntry);        
            iCounter++;   
        }         
    }
};


function LoadAuditProgramme(fileid) {
    var NewEntry = {
        Title: '',
        Background:'',
        Scope:'',
        Domains: []
    };

    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    //audit reference section
    var res = xpath.select("/Audit/About/title/tx[@l='" + credentials.WorkLang + "']/@name",doc);
    if (res.length==1 && res[0] != null) {
        NewEntry.Title = res[0].nodeValue;
    }
    var res = xpath.select("/Audit/Background/ak",doc);
    if (res.length==1 && res[0].firstChild != null) {
        NewEntry.Background = res[0].firstChild.nodeValue;
    }
    var res = xpath.select("/Audit/Scope/ak",doc);
    if (res.length==1 && res[0].firstChild != null) {
        NewEntry.Scope = res[0].firstChild.nodeValue;
    }

    var vPointerDomain='';
    var vDescrDomain='';
    var vTipDomain='';
    var vTipArea='';
    var vTipIssue='';
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
            var res = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/Narrative/narr[@l='" + credentials.WorkLang + "']/ak",doc);
            if (res.length==1 && res[0].firstChild != null){
                vTipDomain=res[0].firstChild.nodeValue;
            } else {
                vTipDomain="No data available";
            }
        }

        var vAreas = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/Area/@nr",doc);
        for (var j=0; j<vAreas.length; j++) {
            var vPointerArea=vAreas[j].nodeValue;
            var vDescrArea=vPointerArea + ' - ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
            var res = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Narrative/narr[@l='" + credentials.WorkLang + "']/ak",doc);
            if (res.length==1 && res[0].firstChild != null){
                vTipArea=res[0].firstChild.nodeValue;
            } else {
                vTipArea="No data available";
            }
 
            var vIssues = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue/@nr",doc);
            for (var k=0; k<vIssues.length; k++) {
                var res = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/Narrative/narr[@l='" + credentials.WorkLang + "']/ak",doc);
                if (res.length==1 && res[0].firstChild != null){
                    vTipIssue=res[0].firstChild.nodeValue;
                } else {
                    vTipIssue="No data available";
                }    

                var NewEntry = {
                    RowId: '#' + String((iCounter+1)),
                    PluginId: 'CORE',
                    Domain: vDescrDomain,
                    DomainId: vPointerDomain,
                    DomainTip: vTipDomain,
                    Area: vDescrArea,
                    AreaId: vPointerArea,
                    AreaTip: vTipArea,
                    Issue: vIssues[k].nodeValue + ' - '  + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue,
                    IssueId: vIssues[k].nodeValue,
                    IssueTip: vTipIssue,
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

module.exports.LoadAuditProgramme = LoadAuditProgramme;
