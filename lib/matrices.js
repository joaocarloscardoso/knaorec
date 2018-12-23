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

function LoadPlanMatrix(fileid, PluginId, DomainId, AreaId, IssueId) {
    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);
    var Objectives='';
    var Criteria='';
    var Inforequired='';
    var Method='';
    var Found='';
    var Conclusion='';

    if (PluginId == 'CORE'){
        var vItems = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + DomainId + "']/Area[@nr='" + AreaId + "']/Issue[@nr='" + IssueId + "']/Matrix/Objectives/obj/tx[@l='" + credentials.WorkLang + "']/@name",doc);
        for (var i=0; i<vItems.length; i++) {
            Objectives= Objectives + vItems[i].nodeValue;
        }
        var vItems = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + DomainId + "']/Area[@nr='" + AreaId + "']/Issue[@nr='" + IssueId + "']/Matrix/Criteria/cri/tx[@l='" + credentials.WorkLang + "']/@name",doc);
        for (var i=0; i<vItems.length; i++) {
            Criteria= Criteria + vItems[i].nodeValue;
        }
        var vItems = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + DomainId + "']/Area[@nr='" + AreaId + "']/Issue[@nr='" + IssueId + "']/Matrix/InformationRequired/inf/tx[@l='" + credentials.WorkLang + "']/@name",doc);
        for (var i=0; i<vItems.length; i++) {
            Inforequired= Inforequired + vItems[i].nodeValue;
        }
        var vItems = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + DomainId + "']/Area[@nr='" + AreaId + "']/Issue[@nr='" + IssueId + "']/Matrix/AnalysisMethod/anm/tx[@l='" + credentials.WorkLang + "']/@name",doc);
        for (var i=0; i<vItems.length; i++) {
            Method= Method + vItems[i].nodeValue;
        }
        var vItems = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + DomainId + "']/Area[@nr='" + AreaId + "']/Issue[@nr='" + IssueId + "']/Matrix/foundPreviously/fp/tx[@l='" + credentials.WorkLang + "']/@name",doc);
        for (var i=0; i<vItems.length; i++) {
            Found= Found + vItems[i].nodeValue;
        }
        var vItems = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + DomainId + "']/Area[@nr='" + AreaId + "']/Issue[@nr='" + IssueId + "']/Matrix/Conclusion/clu/tx[@l='" + credentials.WorkLang + "']/@name",doc);
        for (var i=0; i<vItems.length; i++) {
            Conclusion= Conclusion + vItems[i].nodeValue;
        }
        var NewEntry = {
            PluginId: PluginId,
            DomainId: DomainId,
            AreaId: AreaId,
            IssueId: IssueId,
            Domain: DomainId + ' - ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + DomainId + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue,
            Area: AreaId + ' - ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + DomainId + "']/Area[@nr='" + AreaId + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue,
            Issue: IssueId + ' - ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + DomainId + "']/Area[@nr='" + AreaId + "']/Issue[@nr='" + IssueId + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue,
            Objectives: Objectives,
            Criteria: Criteria,
            Inforequired: Inforequired,
            Method: Method,
            Found: Found,
            Conclusion: Conclusion
        };
    } else {
        var vItems = xpath.select("/Audit/PlugIns/PlugIn[@id='" + PluginId + "']/Domain[@nr='" + DomainId + "']/Area[@nr='" + AreaId + "']/Issue[@nr='" + IssueId + "']/Matrix/Objectives/obj/tx[@l='" + credentials.WorkLang + "']/@name",doc);
        for (var i=0; i<vItems.length; i++) {
            Objectives= Objectives + vItems[i].nodeValue;
        }
        var vItems = xpath.select("/Audit/PlugIns/PlugIn[@id='" + PluginId + "']/Domain[@nr='" + DomainId + "']/Area[@nr='" + AreaId + "']/Issue[@nr='" + IssueId + "']/Matrix/Criteria/cri/tx[@l='" + credentials.WorkLang + "']/@name",doc);
        for (var i=0; i<vItems.length; i++) {
            Criteria= Criteria + vItems[i].nodeValue;
        }
        var vItems = xpath.select("/Audit/PlugIns/PlugIn[@id='" + PluginId + "']/Domain[@nr='" + DomainId + "']/Area[@nr='" + AreaId + "']/Issue[@nr='" + IssueId + "']/Matrix/InformationRequired/inf/tx[@l='" + credentials.WorkLang + "']/@name",doc);
        for (var i=0; i<vItems.length; i++) {
            Inforequired= Inforequired + vItems[i].nodeValue;
        }
        var vItems = xpath.select("/Audit/PlugIns/PlugIn[@id='" + PluginId + "']/Domain[@nr='" + DomainId + "']/Area[@nr='" + AreaId + "']/Issue[@nr='" + IssueId + "']/Matrix/AnalysisMethod/anm/tx[@l='" + credentials.WorkLang + "']/@name",doc);
        for (var i=0; i<vItems.length; i++) {
            Method= Method + vItems[i].nodeValue;
        }
        var vItems = xpath.select("/Audit/PlugIns/PlugIn[@id='" + PluginId + "']/Domain[@nr='" + DomainId + "']/Area[@nr='" + AreaId + "']/Issue[@nr='" + IssueId + "']/Matrix/foundPreviously/fp/tx[@l='" + credentials.WorkLang + "']/@name",doc);
        for (var i=0; i<vItems.length; i++) {
            Found= Found + vItems[i].nodeValue;
        }
        var vItems = xpath.select("/Audit/PlugIns/PlugIn[@id='" + PluginId + "']/Domain[@nr='" + DomainId + "']/Area[@nr='" + AreaId + "']/Issue[@nr='" + IssueId + "']/Matrix/Conclusion/clu/tx[@l='" + credentials.WorkLang + "']/@name",doc);
        for (var i=0; i<vItems.length; i++) {
            Conclusion= Conclusion + vItems[i].nodeValue;
        }
        var NewEntry = {
            PluginId: PluginId,
            DomainId: DomainId,
            AreaId: AreaId,
            IssueId: IssueId,
            Domain: DomainId + ' - ' + xpath.select("/Audit/PlugIns/PlugIn[@id='" + PluginId + "']/Domain[@nr='" + DomainId + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue,
            Area: AreaId + ' - ' + xpath.select("/Audit/PlugIns/PlugIn[@id='" + PluginId + "']/Domain[@nr='" + DomainId + "']/Area[@nr='" + AreaId + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue,
            Issue: IssueId + ' - ' + xpath.select("/Audit/PlugIns/PlugIn[@id='" + PluginId + "']/Domain[@nr='" + DomainId + "']/Area[@nr='" + AreaId + "']/Issue[@nr='" + IssueId + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue,
            Objectives: Objectives,
            Criteria: Criteria,
            Inforequired: Inforequired,
            Method: Method,
            Found: Found,
            Conclusion: Conclusion
        };
    }

    return NewEntry;
};

function LoadFindingMatrix(fileid, FindingId) {
    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    if (FindingId != 'New') {
        var vSource = xpath.select("/Audit/Cases/Case[@nr='" + FindingId + "']/cts/@source",doc)[0].nodeValue;
        var vDomain = xpath.select("/Audit/Cases/Case[@nr='" + FindingId + "']/cts/@domain",doc)[0].nodeValue;
        var vArea =xpath.select("/Audit/Cases/Case[@nr='" + FindingId + "']/cts/@area",doc)[0].nodeValue;
        var vIssue = xpath.select("/Audit/Cases/Case[@nr='" + FindingId + "']/cts/@issue",doc)[0].nodeValue;

        var NewEntry = {
            FindingId: FindingId,
            Sources: GetSourcesForFindings(fileid),
            Domains: GetDomainsForFindings(fileid),
            Areas: GetAreasForFindings(fileid),
            Issues: GetIssuesForFindings(fileid),
            Source: vSource,
            Domain: vSource + '_' + vDomain.substring(0, 2),
            Area: vSource + '_' + vDomain.substring(0, 2) + '_' + vArea.substring(0, 2),
            Issue: vSource + '_' + vDomain.substring(0, 2) + '_' + vArea.substring(0, 2) + '_' + vIssue.substring(0, 2),
            Cause: xpath.select("/Audit/Cases/Case[@nr='" + FindingId + "']/@nm",doc)[0].nodeValue,
            Result: xpath.select("/Audit/Cases/Case[@nr='" + FindingId + "']/@eff",doc)[0].nodeValue,
            Description: xpath.select("/Audit/Cases/Case[@nr='" + FindingId + "']/quote[@type='description']/.",doc)[0].firstChild.nodeValue,
            Recommendation: xpath.select("/Audit/Cases/Case[@nr='" + FindingId + "']/quote[@type='recommendation']/.",doc)[0].firstChild.nodeValue,
            LegalAct: xpath.select("/Audit/Cases/Case[@nr='" + FindingId + "']/@act",doc)[0].nodeValue,
            ReportReference: xpath.select("/Audit/Cases/Case[@nr='" + FindingId + "']/@doc",doc)[0].nodeValue
        };
    } else {
        var NewEntry = {
            FindingId: '(New)',
            Sources: GetSourcesForFindings(fileid),
            Domains: GetDomainsForFindings(fileid),
            Areas: GetAreasForFindings(fileid),
            Issues: GetIssuesForFindings(fileid),
            Source: 'AITAM',
            Domain: 'AITAM_01',
            Area: 'AITAM_01_01',
            Issue: 'AITAM_01_01_01',
            Cause: '',
            Result: '',
            Description: '',
            Recommendation: '',
            LegalAct: '',
            ReportReference: ''
        };
    }

    return NewEntry;
};

function GetSourcesForFindings(fileid){
    var vSources = 'AITAM';

    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    var vItems = xpath.select("/Audit/PlugIns/PlugIn/@id",doc);
    for (var i=0; i<vItems.length; i++) {
        vSources = vSources + '|' + vItems[i].nodeValue;
    }
    return vSources;
};

function GetDomainsForFindings(fileid){
    var vDomains = '';

    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    var vItems = xpath.select("/Audit/ActiveITAuditDomains/Domain/@nr",doc);
    for (var i=0; i<vItems.length; i++) {
        if (vDomains == ''){
            vDomains = 'AITAM_' + vItems[i].nodeValue + '#' + vItems[i].nodeValue + ' ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vItems[i].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
        } else {
            vDomains = vDomains + '|' + 'AITAM_' + vItems[i].nodeValue + '#' + vItems[i].nodeValue + ' ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vItems[i].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
        }
    }
    var vPlugins = xpath.select("/Audit/PlugIns/PlugIn/@id",doc);
    for (var k=0; k<vPlugins.length; k++) {
        var vItems = xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain/@nr",doc);
        for (var i=0; i<vItems.length; i++) {
            if (vDomains == ''){
                vDomains = vPlugins[k].nodeValue + '_' + vItems[i].nodeValue + '#' + vItems[i].nodeValue + ' ' + xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain[@nr='" + vItems[i].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
            } else {
                vDomains = vDomains + '|' + vPlugins[k].nodeValue + '_' + vItems[i].nodeValue + '#' + vItems[i].nodeValue + ' ' + xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain[@nr='" + vItems[i].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
            }
        }
    }

    return vDomains;
};

function GetAreasForFindings(fileid){
    var vAreas = '';

    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    var vDomains = xpath.select("/Audit/ActiveITAuditDomains/Domain/@nr",doc);
    for (var i=0; i<vDomains.length; i++) {
        var vItems = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vDomains[i].nodeValue + "']/Area/@nr",doc);
        for (var j=0; j<vItems.length; j++) {
            if (vAreas == ''){
                vAreas = 'AITAM_' + vDomains[i].nodeValue + '_' + vItems[j].nodeValue + '#' + vItems[j].nodeValue + ' ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vItems[j].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
            } else {
                vAreas = vAreas + '|' + 'AITAM_' + vDomains[i].nodeValue + '_' + vItems[j].nodeValue + '#' + vItems[j].nodeValue + ' ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vItems[j].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
            }
        }
    }

    var vPlugins = xpath.select("/Audit/PlugIns/PlugIn/@id",doc);
    for (var k=0; k<vPlugins.length; k++) {
        var vDomains = xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain/@nr",doc);
        for (var i=0; i<vDomains.length; i++) {
            var vItems = xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain[@nr='" + vDomains[i].nodeValue + "']/Area/@nr",doc);
            for (var j=0; j<vItems.length; j++) {
                if (vAreas == ''){
                    vAreas = vPlugins[k].nodeValue + '_' + vDomains[i].nodeValue + '_' + vItems[j].nodeValue + '#' + vItems[j].nodeValue + ' ' + xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vItems[j].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
                } else {
                    vAreas = vAreas + '|' + vPlugins[k].nodeValue + '_' + vDomains[i].nodeValue + '_' + vItems[j].nodeValue + '#' + vItems[j].nodeValue + ' ' + xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vItems[j].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
                }
            }
        }
    }

    return vAreas;
};

function GetIssuesForFindings(fileid){
    var vIssues = '';

    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    var vDomains = xpath.select("/Audit/ActiveITAuditDomains/Domain/@nr",doc);
    for (var i=0; i<vDomains.length; i++) {
        var vAreas = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vDomains[i].nodeValue + "']/Area/@nr",doc);
        for (var j=0; j<vAreas.length; j++) {
            var vItems = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vAreas[j].nodeValue + "']/Issue/@nr",doc);
            for (var m=0; m<vItems.length; m++) {
                if (vIssues == ''){
                    vIssues = 'AITAM_' + vDomains[i].nodeValue + '_' + vAreas[j].nodeValue + '_' + vItems[m].nodeValue + '#' + vItems[m].nodeValue + ' ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vAreas[j].nodeValue + "']/Issue[@nr='" + vItems[m].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
                } else {
                    vIssues = vIssues + '|' + 'AITAM_' + vDomains[i].nodeValue + '_' + vAreas[j].nodeValue + '_' + vItems[m].nodeValue + '#' + vItems[m].nodeValue + ' ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vAreas[j].nodeValue + "']/Issue[@nr='" + vItems[m].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
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
                    if (vIssues == ''){
                        vIssues = vPlugins[k].nodeValue + '_' + vDomains[i].nodeValue + '_' + vAreas[j].nodeValue + '_' + vItems[m].nodeValue + '#' + vItems[m].nodeValue + ' ' + xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vAreas[j].nodeValue + "']/Issue[@nr='" + vItems[m].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
                    } else {
                        vIssues = vIssues + '|' + vPlugins[k].nodeValue + '_' + vDomains[i].nodeValue + '_' + vAreas[j].nodeValue + '_' + vItems[m].nodeValue + '#' + vItems[m].nodeValue + ' ' + xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vAreas[j].nodeValue + "']/Issue[@nr='" + vItems[m].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
                    }
                }
            }
        }
    }

    return vIssues;
};

function LoadPreAssessMatrix(fileid, AreaId, IssueId) {
    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    var NewEntry = {
        AreaId: AreaId,
        IssueId: IssueId,
        Issue: xpath.select("/Audit/Preassessment/paArea[@nr='" + AreaId + "']/paIssue[@nr='" + IssueId + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue,
        Sections: ''
    };
    var vSections = xpath.select("/Audit/Preassessment/paArea[@nr='" + AreaId + "']/paIssue[@nr='" + IssueId + "']/paMatrix[@nr='01']/paSection/@nr",doc);
    for (var k=0; k<vSections.length; k++) {

    }
return NewEntry;
};

module.exports.LoadPlanMatrix = LoadPlanMatrix;
module.exports.LoadFindingMatrix = LoadFindingMatrix;
module.exports.LoadPreAssessMatrix = LoadPreAssessMatrix;