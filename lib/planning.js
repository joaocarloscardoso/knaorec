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

function LoadPlanningPlugInData(doc, vPointerDomain) {
    var NewEntry = {
        RowId: '#' + String((iCounter+1)),
        PluginId: 'PLUGINID',
        Domain: '01 - Test domain',
        DomainId: '01',
        Area: '01 - Test area',
        AreaId: '01',
        Issue: '01 - Test issue 1',
        IssueId: '01',
        Risk:'3',
        Selected: 'Yes',
        Remarks:''
    };
    Catalog.push(NewEntry);  
    iCounter++;
};

function LoadPlanning(fileid) {
    Catalog = [];

    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    var vPointerDomain='';
    iCounter = 0;
    var vDomains = xpath.select("/ActiveITAuditDomains/Domain",doc);
    for (vDomain in vDomains) {
        if (vPointerDomain != vDomain.getAttribute("nr")) {
            if (vPointerDomain != '') {
                //call method to get plugins data
                LoadPlanningPlugInData(doc, vPointerDomain);
            }
            vPointerDomain != vDomain.GetAttribute("nr");
        }

        var vAreas = vDomain.select("Area");
        //test above, if not use bellow:
        //var vAreas = xpath.select("/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/Area",doc);
        for (vArea in vAreas) {
            var vIssues = vArea.select("Issue");
            //test above, if not use bellow:
            //var vIssues = xpath.select("/ActiveITAuditDomains/Domain[@nr='" + vPointerDomain + "']/Area[@nr='" + vArea.getAttribute("nr") + "']/Issue",doc);
            for (vIssue in vIssues) {
                var NewEntry = {
                    RowId: '#' + String((iCounter+1)),
                    PluginId: 'CORE',
                    Domain: vDomain.getAttribute("nr") + ' ' + vDomain.select("title/tx[@l='" + credentials.WorkLang + "']").getAttribute("name"),
                    DomainId: vDomain.getAttribute("nr"),
                    Area: vArea.getAttribute("nr") + ' '  + vArea.select("title/tx[@l='" + credentials.WorkLang + "']").getAttribute("name"),
                    AreaId: vArea.getAttribute("nr"),
                    Issue: vIssue.getAttribute("nr") + ' '  + vIssue.select("title/tx[@l='" + credentials.WorkLang + "']").getAttribute("name"),
                    IssueId: vIssue.getAttribute("nr"),
                    Risk: vIssue.getAttribute("RiskWeight"),
                    Selected: vIssue.getAttribute("Include"),
                    Remarks: vIssue.getAttribute("Remarks")
                };
                Catalog.push(NewEntry);        
                iCounter++;   
            }         
        }
    }
    //final call method to get plugins data (if not is going to ignore last domain)
    LoadPlanningPlugInData(doc, vPointerDomain);
    return Catalog;
};

module.exports.LoadPlanning = LoadPlanning;
