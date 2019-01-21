//credentials used in the app
var credentials = require('../credentials.js');

var fs = require('fs'),
    path = require('path');

//logging system
var log = require('./log.js');

var xpath   = require('xpath');
var Dom     = require('xmldom').DOMParser;
var iCounter;

function LoadExecutiveSummary(fileid) {
    var ExecutiveSummary = {
        Title: '',
        Background:'',
        Scope:'',
        Findings: []
    };
    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    //audit reference section
    var res = xpath.select("/Audit/About/title/tx[@l='" + credentials.WorkLang + "']/@name",doc);
    if (res.length==1 && res[0] != null) {
        ExecutiveSummary.Title = res[0].nodeValue;
    }
    var res = xpath.select("/Audit/Background/ak",doc);
    if (res.length==1 && res[0].firstChild != null) {
        ExecutiveSummary.Background = res[0].firstChild.nodeValue;
    }
    var res = xpath.select("/Audit/Scope/ak",doc);
    if (res.length==1 && res[0].firstChild != null) {
        ExecutiveSummary.Scope = res[0].firstChild.nodeValue;
    }

    var vFindings = xpath.select("/Audit/Cases/Case[@Include='Yes']/@nr",doc);
    for (var i=0; i<vFindings.length; i++) {
        var Finding = {
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
        };
        ExecutiveSummary.Findings.push(Finding);        
    }  
    return ExecutiveSummary;
};

function LoadAuditProgramme(fileid) {
    var AuditProgramme = {
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
        AuditProgramme.Title = res[0].nodeValue;
    }
    var res = xpath.select("/Audit/Background/ak",doc);
    if (res.length==1 && res[0].firstChild != null) {
        AuditProgramme.Background = res[0].firstChild.nodeValue;
    }
    var res = xpath.select("/Audit/Scope/ak",doc);
    if (res.length==1 && res[0].firstChild != null) {
        AuditProgramme.Scope = res[0].firstChild.nodeValue;
    }

    var vPointerDomain='';
    var vDomains = xpath.select("/Audit/ActiveITAuditDomains/Domain/@nr",doc);
    for (var i=0; i<vDomains.length; i++) {
        vPointerDomain = vDomains[i].nodeValue;
        var vDomain = {
            Domain: vPointerDomain + '. ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue,
            Areas: []
        };
        //call to core AITAM
        var vAreas = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/Area/@nr",doc);
        for (var j=0; j<vAreas.length; j++) {
            var vPointerArea=vAreas[j].nodeValue;
            var vArea = {
                Area: vPointerDomain + '.' +  vPointerArea + '. ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue,
                Issues: []
            };
            var vIssues = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@Include='Yes']/@nr",doc);
            for (var k=0; k<vIssues.length; k++) {
                var res = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/Narrative/narr[@l='" + credentials.WorkLang + "']/ak",doc);
                var vIssue = {
                    Issue: vPointerDomain + '.' +  vPointerArea + '. ' +  vIssues[k].nodeValue + '. '  + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue,
                    Objectives: '',
                    Criteria: '',
                    Inforequired: '',
                    Method: '',
                    Found: '',
                    Conclusion: ''
                };
                var vItems = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/Matrix/Objectives/obj/tx[@l='" + credentials.WorkLang + "']/@name",doc);
                for (var z=0; z<vItems.length; z++) {
                    vIssue.Objectives= vIssue.Objectives + vItems[z].nodeValue;
                }
                var vItems = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/Matrix/Criteria/cri/tx[@l='" + credentials.WorkLang + "']/@name",doc);
                for (var z=0; z<vItems.length; z++) {
                    vIssue.Criteria= vIssue.Criteria + vItems[z].nodeValue;
                }
                var vItems = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/Matrix/InformationRequired/inf/tx[@l='" + credentials.WorkLang + "']/@name",doc);
                for (var z=0; z<vItems.length; z++) {
                    vIssue.Inforequired= vIssue.Inforequired + vItems[z].nodeValue;
                }
                var vItems = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/Matrix/AnalysisMethod/anm/tx[@l='" + credentials.WorkLang + "']/@name",doc);
                for (var z=0; z<vItems.length; z++) {
                    vIssue.Method= vIssue.Method + vItems[z].nodeValue;
                }
                var vItems = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/Matrix/foundPreviously/fp/tx[@l='" + credentials.WorkLang + "']/@name",doc);
                for (var z=0; z<vItems.length; z++) {
                    vIssue.Found= vIssue.Found + vItems[z].nodeValue;
                }
                var vItems = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/Matrix/Conclusion/clu/tx[@l='" + credentials.WorkLang + "']/@name",doc);
                for (var z=0; z<vItems.length; z++) {
                    vIssue.Conclusion= vIssue.Conclusion + vItems[z].nodeValue;
                }
                vArea.Issues.push(vIssue);
            }
            if (vArea.Issues.length > 0 ) {
                vDomain.Areas.push(vArea);
            }
        }
        //end call to core AITAM
        //call to plugins
        var vAreas = xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area/@nr",doc);
        for (var j=0; j<vAreas.length; j++) {
            var vPointerArea=vAreas[j].nodeValue;
			var PluginId = xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/../../@id",doc)[0].nodeValue;
            var vArea = {
                Area: vPointerDomain + '.' +  vPointerArea + '. (' + PluginId + ') ' + xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue,
                Issues: []
            };
            var vIssues = xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@Include='Yes']/@nr",doc);
            for (var k=0; k<vIssues.length; k++) {
                var res = xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/Narrative/narr[@l='" + credentials.WorkLang + "']/ak",doc);
                var vIssue = {
                    Issue: vPointerDomain + '.' +  vPointerArea + '. ' +  vIssues[k].nodeValue + '. '  + xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue,
                    Objectives: '',
                    Criteria: '',
                    Inforequired: '',
                    Method: '',
                    Found: '',
                    Conclusion: ''
                };
                var vItems = xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/Matrix/Objectives/obj/tx[@l='" + credentials.WorkLang + "']/@name",doc);
                for (var z=0; z<vItems.length; z++) {
                    vIssue.Objectives= vIssue.Objectives + vItems[z].nodeValue;
                }
                var vItems = xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/Matrix/Criteria/cri/tx[@l='" + credentials.WorkLang + "']/@name",doc);
                for (var z=0; z<vItems.length; z++) {
                    vIssue.Criteria= vIssue.Criteria + vItems[z].nodeValue;
                }
                var vItems = xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/Matrix/InformationRequired/inf/tx[@l='" + credentials.WorkLang + "']/@name",doc);
                for (var z=0; z<vItems.length; z++) {
                    vIssue.Inforequired= vIssue.Inforequired + vItems[z].nodeValue;
                }
                var vItems = xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/Matrix/AnalysisMethod/anm/tx[@l='" + credentials.WorkLang + "']/@name",doc);
                for (var z=0; z<vItems.length; z++) {
                    vIssue.Method= vIssue.Method + vItems[z].nodeValue;
                }
                var vItems = xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/Matrix/foundPreviously/fp/tx[@l='" + credentials.WorkLang + "']/@name",doc);
                for (var z=0; z<vItems.length; z++) {
                    vIssue.Found= vIssue.Found + vItems[z].nodeValue;
                }
                var vItems = xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vPointerArea + "']/Issue[@nr='" + vIssues[k].nodeValue + "']/Matrix/Conclusion/clu/tx[@l='" + credentials.WorkLang + "']/@name",doc);
                for (var z=0; z<vItems.length; z++) {
                    vIssue.Conclusion= vIssue.Conclusion + vItems[z].nodeValue;
                }
                vArea.Issues.push(vIssue);
            }
            if (vArea.Issues.length > 0 ) {
                vDomain.Areas.push(vArea);
            }
        }
        //end call to plugins
        if (vDomain.Areas.length > 0 ) {
            AuditProgramme.Domains.push(vDomain);
        }
    }
    return AuditProgramme;
};

module.exports.LoadExecutiveSummary = LoadExecutiveSummary;
module.exports.LoadAuditProgramme = LoadAuditProgramme;