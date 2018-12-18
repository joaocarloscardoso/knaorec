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

};

module.exports.LoadPlanMatrix = LoadPlanMatrix;
module.exports.LoadFindingMatrix = LoadFindingMatrix;