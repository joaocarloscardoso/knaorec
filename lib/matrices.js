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
    var tempDescription ='';
    var tempRecommendation ='';

    if (FindingId != 'New') {
        var vSource = xpath.select("/Audit/Cases/Case[@nr='" + FindingId + "']/cts/@source",doc)[0].nodeValue;
        var vDomain = xpath.select("/Audit/Cases/Case[@nr='" + FindingId + "']/cts/@domain",doc)[0].nodeValue;
        var vArea =xpath.select("/Audit/Cases/Case[@nr='" + FindingId + "']/cts/@area",doc)[0].nodeValue;
        var vIssue = xpath.select("/Audit/Cases/Case[@nr='" + FindingId + "']/cts/@issue",doc)[0].nodeValue;

        if (xpath.select("/Audit/Cases/Case[@nr='" + FindingId + "']/quote[@type='description']/.",doc)[0].firstChild === null)
        {
            tempDescription= '';
        }else{
            tempDescription= xpath.select("/Audit/Cases/Case[@nr='" + FindingId + "']/quote[@type='description']/.",doc)[0].firstChild.nodeValue;
        };
        if (xpath.select("/Audit/Cases/Case[@nr='" + FindingId + "']/quote[@type='recommendation']/.",doc)[0].firstChild === null)
        {
            tempRecommendation= '';
        }else{
            tempRecommendation= xpath.select("/Audit/Cases/Case[@nr='" + FindingId + "']/quote[@type='recommendation']/.",doc)[0].firstChild.nodeValue;
        };

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
            DomainDescr: vDomain,
            AreaDescr: vArea,
            IssueDescr: vIssue,
            Cause: xpath.select("/Audit/Cases/Case[@nr='" + FindingId + "']/@nm",doc)[0].nodeValue,
            Result: xpath.select("/Audit/Cases/Case[@nr='" + FindingId + "']/@eff",doc)[0].nodeValue,
            Description: tempDescription,
            Recommendation: tempRecommendation,
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
            DomainDescr: '',
            AreaDescr: '',
            IssueDescr: '',
            Cause: '',
            Result: '',
            Description: '',
            Recommendation: '',
            LegalAct: '',
            ReportReference: ''
        };
        var fSource=NewEntry.Sources.split("|");
        var ftempDomain=NewEntry.Domains.split("|");
        var fDomain=ftempDomain[0].split("#");
        var ftempArea=NewEntry.Areas.split("|");
        var fArea=ftempArea[0].split("#");
        var ftempIssue=NewEntry.Issues.split("|");
        var fIssue=ftempIssue[0].split("#");
        NewEntry.Source=fSource[0];
        NewEntry.Domain=fDomain[0];
        NewEntry.Area=fArea[0];
        NewEntry.Issue=fIssue[0];
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
        var vIncluded =  xpath.select("/Audit/PlugIns/PlugIn[@id='" + vItems[i].nodeValue + "']/Domain/Area/Issue[@Include='Yes']/@nr",doc)
        if (vIncluded.length > 0){
            vSources = vSources + '|' + vItems[i].nodeValue;
        }
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
        var vIncluded =  xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vItems[i].nodeValue + "']/Area/Issue[@Include='Yes']/@nr",doc)
        if (vIncluded.length > 0){
            if (vDomains == ''){
                vDomains = 'AITAM_' + vItems[i].nodeValue + '#' + vItems[i].nodeValue + ' ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vItems[i].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
            } else {
                vDomains = vDomains + '|' + 'AITAM_' + vItems[i].nodeValue + '#' + vItems[i].nodeValue + ' ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vItems[i].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
            }
        }
    }
    var vPlugins = xpath.select("/Audit/PlugIns/PlugIn/@id",doc);
    for (var k=0; k<vPlugins.length; k++) {
        var vItems = xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain/@nr",doc);
        for (var i=0; i<vItems.length; i++) {
            var vIncluded =  xpath.select("/Audit/PlugIns/PlugIn/Domain[@nr='" + vItems[i].nodeValue + "']/Area/Issue[@Include='Yes']/@nr",doc)
            if (vIncluded.length > 0){
                if (vDomains == ''){
                    vDomains = vPlugins[k].nodeValue + '_' + vItems[i].nodeValue + '#' + vItems[i].nodeValue + ' ' + xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain[@nr='" + vItems[i].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
                } else {
                    vDomains = vDomains + '|' + vPlugins[k].nodeValue + '_' + vItems[i].nodeValue + '#' + vItems[i].nodeValue + ' ' + xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain[@nr='" + vItems[i].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
                }
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
            var vIncluded =  xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vItems[j].nodeValue + "']/Issue[@Include='Yes']/@nr",doc)
            if (vIncluded.length > 0){
                if (vAreas == ''){
                    vAreas = 'AITAM_' + vDomains[i].nodeValue + '_' + vItems[j].nodeValue + '#' + vItems[j].nodeValue + ' ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vItems[j].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
                } else {
                    vAreas = vAreas + '|' + 'AITAM_' + vDomains[i].nodeValue + '_' + vItems[j].nodeValue + '#' + vItems[j].nodeValue + ' ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vItems[j].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
                }
            }
        }
    }

    var vPlugins = xpath.select("/Audit/PlugIns/PlugIn/@id",doc);
    for (var k=0; k<vPlugins.length; k++) {
        var vDomains = xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain/@nr",doc);
        for (var i=0; i<vDomains.length; i++) {
            var vItems = xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain[@nr='" + vDomains[i].nodeValue + "']/Area/@nr",doc);
            for (var j=0; j<vItems.length; j++) {
                var vIncluded =  xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vItems[j].nodeValue + "']/Issue[@Include='Yes']/@nr",doc)
                if (vIncluded.length > 0){
                    if (vAreas == ''){
                        vAreas = vPlugins[k].nodeValue + '_' + vDomains[i].nodeValue + '_' + vItems[j].nodeValue + '#' + vItems[j].nodeValue + ' ' + xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vItems[j].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
                    } else {
                        vAreas = vAreas + '|' + vPlugins[k].nodeValue + '_' + vDomains[i].nodeValue + '_' + vItems[j].nodeValue + '#' + vItems[j].nodeValue + ' ' + xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vItems[j].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
                    }
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
                var vIncluded =  xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vAreas[j].nodeValue + "']/Issue[@nr='" + vItems[m].nodeValue + "']/@Include",doc)[0].nodeValue;
                if (vIncluded == "Yes"){ 
                    if (vIssues == ''){
                        vIssues = 'AITAM_' + vDomains[i].nodeValue + '_' + vAreas[j].nodeValue + '_' + vItems[m].nodeValue + '#' + vItems[m].nodeValue + ' ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vAreas[j].nodeValue + "']/Issue[@nr='" + vItems[m].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
                    } else {
                        vIssues = vIssues + '|' + 'AITAM_' + vDomains[i].nodeValue + '_' + vAreas[j].nodeValue + '_' + vItems[m].nodeValue + '#' + vItems[m].nodeValue + ' ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vAreas[j].nodeValue + "']/Issue[@nr='" + vItems[m].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
                    }
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
                        if (vIssues == ''){
                            vIssues = vPlugins[k].nodeValue + '_' + vDomains[i].nodeValue + '_' + vAreas[j].nodeValue + '_' + vItems[m].nodeValue + '#' + vItems[m].nodeValue + ' ' + xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vAreas[j].nodeValue + "']/Issue[@nr='" + vItems[m].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
                        } else {
                            vIssues = vIssues + '|' + vPlugins[k].nodeValue + '_' + vDomains[i].nodeValue + '_' + vAreas[j].nodeValue + '_' + vItems[m].nodeValue + '#' + vItems[m].nodeValue + ' ' + xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[k].nodeValue + "']/Domain[@nr='" + vDomains[i].nodeValue + "']/Area[@nr='" + vAreas[j].nodeValue + "']/Issue[@nr='" + vItems[m].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
                        }
                    }
                }
            }
        }
    }

    return vIssues;
};

function LoadPreAssessMatrix(fileid, AreaId, IssueId) {
    var RelatesSection = '';
    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    var NewEntry = {
        AreaId: AreaId,
        IssueId: IssueId,
        Issue: xpath.select("/Audit/Preassessment/paArea[@nr='" + AreaId + "']/paIssue[@nr='" + IssueId + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue,
        Sections: []
    };
    
    var vSections = xpath.select("/Audit/Preassessment/paArea[@nr='" + AreaId + "']/paIssue[@nr='" + IssueId + "']/paMatrix[@nr='01']/paSection/@nr",doc);
    for (var k=0; k<vSections.length; k++) {
        RelatesSection = xpath.select("/Audit/Preassessment/paArea[@nr='" + AreaId + "']/paIssue[@nr='" + IssueId + "']/paMatrix[@nr='01']/paSection[@nr='" + vSections[k].nodeValue + "']/@relatesto",doc)[0].nodeValue;
        if (RelatesSection =='') {
            //static section
            var objSection = {
                SectionId: vSections[k].nodeValue,
                SectionName: xpath.select("/Audit/Preassessment/paArea[@nr='" + AreaId + "']/paIssue[@nr='" + IssueId + "']/paMatrix[@nr='01']/paSection[@nr='" + vSections[k].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue,
                Elements: []
            };
            var vElements = xpath.select("/Audit/Preassessment/paArea[@nr='" + AreaId + "']/paIssue[@nr='" + IssueId + "']/paMatrix[@nr='01']/paSection[@nr='" + vSections[k].nodeValue + "']/paElement/@nr",doc);
            for (var m=0; m<vElements.length; m++) {
                var RelatesElement = xpath.select("/Audit/Preassessment/paArea[@nr='" + AreaId + "']/paIssue[@nr='" + IssueId + "']/paMatrix[@nr='01']/paSection[@nr='" + vSections[k].nodeValue + "']/paElement[@nr='" + vElements[m].nodeValue + "']/@relatesto",doc)[0].nodeValue;
                if (RelatesElement =='') {
                    var objElement = {
                        RefId: vSections[k].nodeValue + '_' + vElements[m].nodeValue,
                        ElementId:vElements[m].nodeValue,
                        ElementName: xpath.select("/Audit/Preassessment/paArea[@nr='" + AreaId + "']/paIssue[@nr='" + IssueId + "']/paMatrix[@nr='01']/paSection[@nr='" + vSections[k].nodeValue + "']/paElement[@nr='" + vElements[m].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue,
                        Type: xpath.select("/Audit/Preassessment/paArea[@nr='" + AreaId + "']/paIssue[@nr='" + IssueId + "']/paMatrix[@nr='01']/paSection[@nr='" + vSections[k].nodeValue + "']/paElement[@nr='" + vElements[m].nodeValue + "']/@type",doc)[0].nodeValue, 
                        Values:xpath.select("/Audit/Preassessment/paArea[@nr='" + AreaId + "']/paIssue[@nr='" + IssueId + "']/paMatrix[@nr='01']/paSection[@nr='" + vSections[k].nodeValue + "']/paElement[@nr='" + vElements[m].nodeValue + "']/@value",doc)[0].nodeValue,
                        Value: xpath.select("/Audit/Preassessment/paArea[@nr='" + AreaId + "']/paIssue[@nr='" + IssueId + "']/paMatrix[@nr='01']/paSection[@nr='" + vSections[k].nodeValue + "']/paElement[@nr='" + vElements[m].nodeValue + "']/val/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue
                    };
                    objSection.Elements.push(objElement);     
                }
            }
            NewEntry.Sections.push(objSection);
        } else if (RelatesSection =='Domain') {
            //dynamic section
            var vDomains = xpath.select("/Audit/ActiveITAuditDomains/Domain/@nr",doc);
            for (var n=0; n<vDomains.length; n++) {
                var objSection = {
                    SectionId: vDomains[n].nodeValue,
                    SectionName: xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vDomains[n].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue,
                    Elements: []
                };    
                var vElements = xpath.select("/Audit/Preassessment/paArea[@nr='" + AreaId + "']/paIssue[@nr='" + IssueId + "']/paMatrix[@nr='01']/paSection[@nr='" + vSections[k].nodeValue + "']/paElement/@nr",doc);
                for (var m=0; m<vElements.length; m++) {
                    var RelatesElement = xpath.select("/Audit/Preassessment/paArea[@nr='" + AreaId + "']/paIssue[@nr='" + IssueId + "']/paMatrix[@nr='01']/paSection[@nr='" + vSections[k].nodeValue + "']/paElement[@nr='" + vElements[m].nodeValue + "']/@relatesto",doc)[0].nodeValue;
                    if (RelatesElement =='') {
                        var elementValue = xpath.select("/Audit/Preassessment/paArea[@nr='" + AreaId + "']/paIssue[@nr='" + IssueId + "']/paMatrix[@nr='01']/paSection[@nr='" + vSections[k].nodeValue + "']/paElement[@nr='" + vElements[m].nodeValue + "']/val/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
                        //check if exists already an instance with value and get value to "elementValue"
                        var TestElementValue = xpath.select("/Audit/Preassessment/paArea[@nr='" + AreaId + "']/paIssue[@nr='" + IssueId + "']/paMatrix[@nr='01']/paSection[@nr='" + vSections[k].nodeValue + "']/Instances/IElement[@nr='" + vSections[k].nodeValue + '|' + vDomains[n].nodeValue + '_' + vElements[m].nodeValue + "']/@name",doc);
                        if (TestElementValue.length > 0){ 
                            elementValue = TestElementValue[0].nodeValue;
                        }

                        var objElement = {
                            RefId: vSections[k].nodeValue + '|' + vDomains[n].nodeValue + '_' + vElements[m].nodeValue,
                            ElementId:vElements[m].nodeValue,
                            ElementName: xpath.select("/Audit/Preassessment/paArea[@nr='" + AreaId + "']/paIssue[@nr='" + IssueId + "']/paMatrix[@nr='01']/paSection[@nr='" + vSections[k].nodeValue + "']/paElement[@nr='" + vElements[m].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue,
                            Type: xpath.select("/Audit/Preassessment/paArea[@nr='" + AreaId + "']/paIssue[@nr='" + IssueId + "']/paMatrix[@nr='01']/paSection[@nr='" + vSections[k].nodeValue + "']/paElement[@nr='" + vElements[m].nodeValue + "']/@type",doc)[0].nodeValue, 
                            Values:xpath.select("/Audit/Preassessment/paArea[@nr='" + AreaId + "']/paIssue[@nr='" + IssueId + "']/paMatrix[@nr='01']/paSection[@nr='" + vSections[k].nodeValue + "']/paElement[@nr='" + vElements[m].nodeValue + "']/@value",doc)[0].nodeValue,
                            Value: elementValue
                        };
                        objSection.Elements.push(objElement);     
                    } else if (RelatesElement =='Area') {
                        //get default value to apply
                        var elementValue = xpath.select("/Audit/Preassessment/paArea[@nr='" + AreaId + "']/paIssue[@nr='" + IssueId + "']/paMatrix[@nr='01']/paSection[@nr='" + vSections[k].nodeValue + "']/paElement[@nr='" + vElements[m].nodeValue + "']/val/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue;
                        //check core AITAm
                        var vAreas = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vDomains[n].nodeValue + "']/Area/@nr",doc)
                        for (var y=0; y<vAreas.length; y++) {
                            //check if exists already an instance with value and get value to "elementValue"
                            var TestElementValue = xpath.select("/Audit/Preassessment/paArea[@nr='" + AreaId + "']/paIssue[@nr='" + IssueId + "']/paMatrix[@nr='01']/paSection[@nr='" + vSections[k].nodeValue + "']/Instances/IElement[@nr='" + vSections[k].nodeValue + '|' + vDomains[n].nodeValue + '_' + vElements[m].nodeValue + '|' + vAreas[y].nodeValue + "']/@name",doc);
                            if (TestElementValue.length > 0){ 
                                elementValue = TestElementValue[0].nodeValue;
                            }    

                            var objElement = {
                                RefId: vSections[k].nodeValue + '|' + vDomains[n].nodeValue + '_' + vElements[m].nodeValue + '|' + vAreas[y].nodeValue,
                                ElementId:vAreas[y].nodeValue,
                                ElementName: xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vDomains[n].nodeValue + "']/Area[@nr='" + vAreas[y].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue,
                                Type: xpath.select("/Audit/Preassessment/paArea[@nr='" + AreaId + "']/paIssue[@nr='" + IssueId + "']/paMatrix[@nr='01']/paSection[@nr='" + vSections[k].nodeValue + "']/paElement[@nr='" + vElements[m].nodeValue + "']/@type",doc)[0].nodeValue, 
                                Values:xpath.select("/Audit/Preassessment/paArea[@nr='" + AreaId + "']/paIssue[@nr='" + IssueId + "']/paMatrix[@nr='01']/paSection[@nr='" + vSections[k].nodeValue + "']/paElement[@nr='" + vElements[m].nodeValue + "']/@value",doc)[0].nodeValue,
                                Value: elementValue
                            };
                            objSection.Elements.push(objElement);                                 
                        }
                        //check plugins
                        var vPlugins = xpath.select("/Audit/PlugIns/PlugIn/@id",doc);
                        for (var x=0; x<vPlugins.length; x++) {
                            var vAreas = xpath.select("/Audit/PlugIns/PlugIn[@id='" + vPlugins[x].nodeValue + "']/Domain[@nr='" + vDomains[n].nodeValue + "']/Area/@nr",doc)
                            for (var y=0; y<vAreas.length; y++) {
                                //check if exists already an instance with value and get value to "elementValue"
                                var TestElementValue = xpath.select("/Audit/Preassessment/paArea[@nr='" + AreaId + "']/paIssue[@nr='" + IssueId + "']/paMatrix[@nr='01']/paSection[@nr='" + vSections[k].nodeValue + "']/Instances/IElement[@nr='" + vSections[k].nodeValue + '|' + vDomains[n].nodeValue + '_' + vElements[m].nodeValue + '|' + vAreas[y].nodeValue + '#' + vPlugins[x].nodeValue + "']/@name",doc);
                                if (TestElementValue.length > 0){ 
                                    elementValue = TestElementValue[0].nodeValue;
                                }    
    
                                var objElement = {
                                    RefId: vSections[k].nodeValue + '|' + vDomains[n].nodeValue + '_' + vElements[m].nodeValue + '|' + vAreas[y].nodeValue + '#' + vPlugins[x].nodeValue,
                                    ElementId:vAreas[y].nodeValue,
                                    ElementName: xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + vDomains[n].nodeValue + "']/Area[@nr='" + vAreas[y].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue,
                                    Type: xpath.select("/Audit/Preassessment/paArea[@nr='" + AreaId + "']/paIssue[@nr='" + IssueId + "']/paMatrix[@nr='01']/paSection[@nr='" + vSections[k].nodeValue + "']/paElement[@nr='" + vElements[m].nodeValue + "']/@type",doc)[0].nodeValue, 
                                    Values:xpath.select("/Audit/Preassessment/paArea[@nr='" + AreaId + "']/paIssue[@nr='" + IssueId + "']/paMatrix[@nr='01']/paSection[@nr='" + vSections[k].nodeValue + "']/paElement[@nr='" + vElements[m].nodeValue + "']/@value",doc)[0].nodeValue,
                                    Value: elementValue
                                };
                                objSection.Elements.push(objElement);                                 
                            }
                        }
                    }
                }
                NewEntry.Sections.push(objSection);
            }
        }
        RelatesSection = '';
    }
    
return NewEntry;
};

function SavePlanMatrix(fileid, Catalog) {
    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    if (Catalog.PluginId == 'CORE'){
        var res = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + Catalog.DomainId + "']/Area[@nr='" + Catalog.AreaId + "']/Issue[@nr='" + Catalog.IssueId + "']/Matrix/Objectives/obj/tx[@l='" + credentials.WorkLang + "']/.",doc);
        res[0].setAttribute('name',Catalog.Objectives);    

        var res = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + Catalog.DomainId + "']/Area[@nr='" + Catalog.AreaId + "']/Issue[@nr='" + Catalog.IssueId + "']/Matrix/Criteria/cri/tx[@l='" + credentials.WorkLang + "']/.",doc);
        res[0].setAttribute('name',Catalog.Criteria);    

        var res = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + Catalog.DomainId + "']/Area[@nr='" + Catalog.AreaId + "']/Issue[@nr='" + Catalog.IssueId + "']/Matrix/InformationRequired/inf/tx[@l='" + credentials.WorkLang + "']/.",doc);
        res[0].setAttribute('name',Catalog.Inforequired);    

        var res = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + Catalog.DomainId + "']/Area[@nr='" + Catalog.AreaId + "']/Issue[@nr='" + Catalog.IssueId + "']/Matrix/AnalysisMethod/anm/tx[@l='" + credentials.WorkLang + "']/.",doc);
        res[0].setAttribute('name',Catalog.Method);    

        var res = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + Catalog.DomainId + "']/Area[@nr='" + Catalog.AreaId + "']/Issue[@nr='" + Catalog.IssueId + "']/Matrix/foundPreviously/fp/tx[@l='" + credentials.WorkLang + "']/.",doc);
        res[0].setAttribute('name',Catalog.Found);    

        var res = xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + Catalog.DomainId + "']/Area[@nr='" + Catalog.AreaId + "']/Issue[@nr='" + Catalog.IssueId + "']/Matrix/Conclusion/clu/tx[@l='" + credentials.WorkLang + "']/.",doc);
        res[0].setAttribute('name',Catalog.Conclusion);    

    } else {
        var res = xpath.select("/Audit/PlugIns/PlugIn[@id='" + Catalog.PluginId + "']/Domain[@nr='" + Catalog.DomainId + "']/Area[@nr='" + Catalog.AreaId + "']/Issue[@nr='" + Catalog.IssueId + "']/Matrix/Objectives/obj/tx[@l='" + credentials.WorkLang + "']/.",doc);
        res[0].setAttribute('name',Catalog.Objectives);    

        var res = xpath.select("/Audit/PlugIns/PlugIn[@id='" + Catalog.PluginId + "']/Domain[@nr='" + Catalog.DomainId + "']/Area[@nr='" + Catalog.AreaId + "']/Issue[@nr='" + Catalog.IssueId + "']/Matrix/Criteria/cri/tx[@l='" + credentials.WorkLang + "']/.",doc);
        res[0].setAttribute('name',Catalog.Criteria);    

        var res = xpath.select("/Audit/PlugIns/PlugIn[@id='" + Catalog.PluginId + "']/Domain[@nr='" + Catalog.DomainId + "']/Area[@nr='" + Catalog.AreaId + "']/Issue[@nr='" + Catalog.IssueId + "']/Matrix/InformationRequired/inf/tx[@l='" + credentials.WorkLang + "']/.",doc);
        res[0].setAttribute('name',Catalog.Inforequired);    

        var res = xpath.select("/Audit/PlugIns/PlugIn[@id='" + Catalog.PluginId + "']/Domain[@nr='" + Catalog.DomainId + "']/Area[@nr='" + Catalog.AreaId + "']/Issue[@nr='" + Catalog.IssueId + "']/Matrix/AnalysisMethod/anm/tx[@l='" + credentials.WorkLang + "']/.",doc);
        res[0].setAttribute('name',Catalog.Method);    

        var res = xpath.select("/Audit/PlugIns/PlugIn[@id='" + Catalog.PluginId + "']/Domain[@nr='" + Catalog.DomainId + "']/Area[@nr='" + Catalog.AreaId + "']/Issue[@nr='" + Catalog.IssueId + "']/Matrix/foundPreviously/fp/tx[@l='" + credentials.WorkLang + "']/.",doc);
        res[0].setAttribute('name',Catalog.Found);    

        var res = xpath.select("/Audit/PlugIns/PlugIn[@id='" + Catalog.PluginId + "']/Domain[@nr='" + Catalog.DomainId + "']/Area[@nr='" + Catalog.AreaId + "']/Issue[@nr='" + Catalog.IssueId + "']/Matrix/Conclusion/clu/tx[@l='" + credentials.WorkLang + "']/.",doc);
        res[0].setAttribute('name',Catalog.Conclusion);    
    }

    var writetofile = new XMLSerializer().serializeToString(doc);
    fs.writeFileSync(fileid, writetofile);
    return true;
};

function SaveFindingMatrix(fileid, Catalog) {
    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    var FindingIdRef='';
    if (Catalog.FindingId == '(New)'){
        // Return today's date and time to create finding reference
        var currentTime = new Date();
        var seconds = currentTime.getSeconds();
        var minutes = currentTime.getMinutes();
        var hour = currentTime.getHours();
        var month = currentTime.getMonth() + 1;
        var day = currentTime.getDate();
        var year = currentTime.getFullYear();      
        FindingIdRef = 'F' + year.toString() + ('0' + month.toString()).slice(-2)  + ('0' + day.toString()).slice(-2) + '-' + ('0' + hour.toString()).slice(-2) + ('0' + minutes.toString()).slice(-2) + ('0' + seconds.toString()).slice(-2);

        var res = xpath.select("/Audit/Cases",doc);
        res[0].appendChild(doc.createElement('Case'));
        res[0].lastChild.setAttribute('nr', FindingIdRef);
        res[0].lastChild.setAttribute('nm', Catalog.Cause);
        res[0].lastChild.setAttribute('eff',Catalog.Result);
        res[0].lastChild.setAttribute('act',Catalog.LegalAct);
        res[0].lastChild.setAttribute('doc',Catalog.ReportReference);
        res[0].lastChild.setAttribute('Include','Yes');

        var res = xpath.select("/Audit/Cases/Case[@nr='" + FindingIdRef + "']/.",doc);
        res[0].appendChild(doc.createElement('cts'));
        if (Catalog.Source == 'AITAM'){
            res[0].lastChild.setAttribute('source', Catalog.Source);
            res[0].lastChild.setAttribute('domain',Catalog.Domain + ' ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + Catalog.Domain + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue);
            res[0].lastChild.setAttribute('area',Catalog.Area + ' ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + Catalog.Domain + "']/Area[@nr='" + Catalog.Area + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue);
            res[0].lastChild.setAttribute('issue',Catalog.Issue + ' ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + Catalog.Domain + "']/Area[@nr='" + Catalog.Area + "']/Issue[@nr='" + Catalog.Issue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue);
        } else {
            res[0].lastChild.setAttribute('source', Catalog.Source);
            res[0].lastChild.setAttribute('domain',Catalog.Domain + ' ' + xpath.select("/Audit/PlugIns/PlugIn[@id='" + Catalog.Source + "']/Domain[@nr='" + Catalog.Domain + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue);
            res[0].lastChild.setAttribute('area', Catalog.Area + ' ' + xpath.select("/Audit/PlugIns/PlugIn[@id='" + Catalog.Source + "']/Domain[@nr='" + Catalog.Domain + "']/Area[@nr='" + Catalog.Area + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue);
            res[0].lastChild.setAttribute('issue', Catalog.Issue + ' ' + xpath.select("/Audit/PlugIns/PlugIn[@id='" + Catalog.Source + "']/Domain[@nr='" + Catalog.Domain + "']/Area[@nr='" + Catalog.Area + "']/Issue[@nr='" + Catalog.Issue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue);
        }
        res[0].appendChild(doc.createElement('quote'));
        res[0].lastChild.setAttribute('type', 'description');
        res[0].lastChild.appendChild(doc.createTextNode(Catalog.Description));
        res[0].appendChild(doc.createElement('quote'));
        res[0].lastChild.setAttribute('type', 'recommendation');
        res[0].lastChild.appendChild(doc.createTextNode(Catalog.Recommendation));
     } else {
        FindingIdRef = Catalog.FindingId;
        var res = xpath.select("/Audit/Cases/Case[@nr='" + Catalog.FindingId + "']/.",doc);
        res[0].setAttribute('nm', Catalog.Cause);
        res[0].setAttribute('eff',Catalog.Result);
        res[0].setAttribute('act',Catalog.LegalAct);
        res[0].setAttribute('doc',Catalog.ReportReference);

        if (Catalog.Source == 'AITAM'){
            var res = xpath.select("/Audit/Cases/Case[@nr='" + Catalog.FindingId + "']/cts/.",doc);
            res[0].setAttribute('source', Catalog.Source);
            res[0].setAttribute('domain',Catalog.Domain + ' ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + Catalog.Domain + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue);
            res[0].setAttribute('area',Catalog.Area + ' ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + Catalog.Domain + "']/Area[@nr='" + Catalog.Area + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue);
            res[0].setAttribute('issue',Catalog.Issue + ' ' + xpath.select("/Audit/ActiveITAuditDomains/Domain[@nr='" + Catalog.Domain + "']/Area[@nr='" + Catalog.Area + "']/Issue[@nr='" + Catalog.Issue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue);
        } else {
            var res = xpath.select("/Audit/Cases/Case[@nr='" + Catalog.FindingId + "']/cts/.",doc);
            res[0].setAttribute('source', Catalog.Source);
            res[0].setAttribute('domain',Catalog.Domain + ' ' + xpath.select("/Audit/PlugIns/PlugIn[@id='" + Catalog.Source + "']/Domain[@nr='" + Catalog.Domain + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue);
            res[0].setAttribute('area', Catalog.Area + ' ' + xpath.select("/Audit/PlugIns/PlugIn[@id='" + Catalog.Source + "']/Domain[@nr='" + Catalog.Domain + "']/Area[@nr='" + Catalog.Area + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue);
            res[0].setAttribute('issue', Catalog.Issue + ' ' + xpath.select("/Audit/PlugIns/PlugIn[@id='" + Catalog.Source + "']/Domain[@nr='" + Catalog.Domain + "']/Area[@nr='" + Catalog.Area + "']/Issue[@nr='" + Catalog.Issue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue);
        }

        var res = xpath.select("/Audit/Cases/Case[@nr='" + Catalog.FindingId + "']/quote[@type='description']/.",doc);
        res[0].firstChild.data=Catalog.Description;
        var res = xpath.select("/Audit/Cases/Case[@nr='" + Catalog.FindingId + "']/quote[@type='recommendation']/.",doc);
        res[0].firstChild.data=Catalog.Recommendation;
    }
    var writetofile = new XMLSerializer().serializeToString(doc);
    fs.writeFileSync(fileid, writetofile);
    return FindingIdRef;
};

function SavePreAssessMatrix(fileid, Catalog, AreaId, IssueId) {
    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);
    
    var commonXpath = "/Audit/Preassessment/paArea[@nr='" + AreaId + "']/paIssue[@nr='" + IssueId + "']/paMatrix[@nr='01']";

    for (let i = 0; i < Catalog.length; i++) {
        if (Catalog[i].Type == 'Element'){
            var vItems = Catalog[i].Reference.split("_");
            var res = xpath.select(commonXpath + "/paSection[@nr='" + vItems[0] + "']/paElement[@nr='" + vItems[1] + "']/val/tx[@l='" + credentials.WorkLang + "']/.",doc);
            if (res.length == 0) {
                var Parent = xpath.select(commonXpath + "/paSection[@nr='" + vItems[0] + "']/paElement[@nr='" + vItems[1] + "']/val",doc);
                Parent[0].appendChild(doc.createElement('tx'));
                Parent[0].lastChild.setAttribute('l', credentials.WorkLang);
                Parent[0].lastChild.setAttribute('name', Catalog[i].Value);
            } else {
                res[0].setAttribute('name', Catalog[i].Value);
            }
        } else {
            var vSection = '';
            var vItems = Catalog[i].Reference.split("_");
            if (vItems[0].indexOf("|")== -1){
                vSection = vItems[0];
            } else {
                var subItems = vItems[0].split("|");
                vSection = subItems[0];
            }
            var res = xpath.select(commonXpath + "/paSection[@nr='" + vSection + "']/Instances",doc);
            if (res.length == 0) {
                var Parent = xpath.select(commonXpath + "/paSection[@nr='" + vSection + "']/.",doc);
                Parent[0].appendChild(doc.createElement('Instances'));
                Parent[0].lastChild.setAttribute('l', credentials.WorkLang);
                Parent[0].lastChild.setAttribute('name', Catalog[i].Value);
            }
            res = xpath.select(commonXpath + "/paSection[@nr='" + vSection + "']/Instances/IElement[@nr='" + Catalog[i].Reference + "' and @l='" + credentials.WorkLang + "']/.",doc);
            if (res.length == 0) {
                var Parent = xpath.select(commonXpath + "/paSection[@nr='" + vSection + "']/Instances",doc);
                Parent[0].appendChild(doc.createElement('IElement'));
                Parent[0].lastChild.setAttribute('nr', Catalog[i].Reference);
                Parent[0].lastChild.setAttribute('l', credentials.WorkLang);
                Parent[0].lastChild.setAttribute('name', Catalog[i].Value);
            } else {
                res[0].setAttribute('name', Catalog[i].Value);
            }
        }
    }

    var writetofile = new XMLSerializer().serializeToString(doc);
    fs.writeFileSync(fileid, writetofile);
    return true;
};


module.exports.LoadPlanMatrix = LoadPlanMatrix;
module.exports.LoadFindingMatrix = LoadFindingMatrix;
module.exports.LoadPreAssessMatrix = LoadPreAssessMatrix;
module.exports.SavePlanMatrix = SavePlanMatrix;
module.exports.SaveFindingMatrix = SaveFindingMatrix;
module.exports.SavePreAssessMatrix = SavePreAssessMatrix;