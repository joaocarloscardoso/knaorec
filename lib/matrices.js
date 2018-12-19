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
            Domains: GetDomainsForFindings(fileid, vSource),
            Source: vSource,
            Domain: vDomain,
            Area: vArea,
            Issue: vIssue,
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
            Domains: GetDomainsForFindings(fileid, 'AITAM'),
            Source: 'AITAM',
            Domain: '01',
            Area: '01',
            Issue: '01',
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

function GetDomainsForFindings(fileid, vSource){
    var vDomains = '';

    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    if (vSource == 'AITAM') { 
        var vItems = xpath.select("/Audit/ActiveITAuditDomains/Domain/@nr",doc);
        for (var i=0; i<vItems.length; i++) {
            if (vDomains == ''){
                vDomains = vItems[i].nodeValue + ' ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vItems[i].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
            } else {
                vDomains = vDomains + '|' + vItems[i].nodeValue + ' ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vItems[i].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
            }
        }
    } else {
        var vItems = xpath.select("/Audit/PlugIns/PlugIn[@id='" + vSource + "']/Domain/@nr",doc);
        for (var i=0; i<vItems.length; i++) {
            if (vDomains == ''){
                vDomains = vItems[i].nodeValue + ' ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vItems[i].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
            } else {
                vDomains = vDomains + '|' + vItems[i].nodeValue + ' ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vItems[i].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
            }
        }
     }
    return vDomains;
};

module.exports.LoadPlanMatrix = LoadPlanMatrix;
module.exports.LoadFindingMatrix = LoadFindingMatrix;