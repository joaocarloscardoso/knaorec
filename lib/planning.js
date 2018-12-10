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

function SyncPreAssessmentWithRiskAnalysis(fileid) {
    //reset variables values
    var vGenericValue = 0;
    var vGenericCount = 0;
    var vDomainValue = '';
    var vAreaValue = '';
    var vDomainRiskValue = '1';
    var vDomainRiskNote = '';

    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    var vItems = xpath.select("/Audit/Preassessment/paArea[@nr='A2']/paIssue[@nr='02']/paMatrix[@nr='01']/paSection[@nr='01']/Instances/IElement[@l='" + credentials.WorkLang + "']/@nr");
    for (var i=0; i<vItems.length; i++) {
        var ListArray=vItems[i].nodeValue.split("_");
        var SubListArray = ListArray[0].split("|");

        var vItemName = xpath.select("/Audit/Preassessment/paArea[@nr='A2']/paIssue[@nr='02']/paMatrix[@nr='01']/paSection[@nr='01']/Instances/IElement[@l='" + credentials.WorkLang + "' and @nr='" + vItems[i].nodeValue + "']/@name")[0].nodeValue;

        //get domain
        if (vDomainValue != SubListArray[1]) {
            vDomainValue = SubListArray[1];
            vGenericValue = 0;
            vGenericCount = 0;
            vDomainRiskValue = "1";
            vDomainRiskNote = "";
        }
        //generic risk evaluation for domain
        if (ListArray[1].indexOf("|")== -1) {
            if (vItemName == "High") {
              vGenericValue = vGenericValue + 3;
              vGenericCount = vGenericCount + 1;
            } else if (vItemName == "Medium") {
              vGenericValue = vGenericValue + 2;
              vGenericCount = vGenericCount + 1;
            } else if (vItemName == "Low") {
              vGenericValue = vGenericValue + 1;
              vGenericCount = vGenericCount + 1;
            }
        } else {
            if (vDomainValue != "") {
                if (vGenericValue != 0) {
                    //apply generic evaluation to all domain
                    //if is a precaution
                    vDomainInterval = Round(vGenericValue / IIf(vGenericCount = 0, 1, vGenericCount));
                    if (vDomainInterval == 3) {
                        vDomainRiskValue = "3";
                    } else if (vDomainInterval == 2) {
                        vDomainRiskValue = "2";
                    } else {
                        vDomainRiskValue = "1";
                    }
                    vDomainRiskNote = "Pre-Assessment: " + (IIf(vDomainInterval = 3, "Domain - High; ", IIf(vDomainInterval = 2, "Domain - Medium; ", "Domain - Low; ")));                    
                }
            }
            /*
            If vDomainValue <> "" Then
                If vGenericValue <> 0 Then
                    'apply generic evaluation to all domain
                    'if is a precaution
                    vDomainInterval = Round(vGenericValue / IIf(vGenericCount = 0, 1, vGenericCount))
                    If vDomainInterval = 3 Then
                        vDomainRiskValue = "3 - High"
                    ElseIf vDomainInterval = 2 Then
                        vDomainRiskValue = "2 - Medium"
                    Else
                        vDomainRiskValue = "1 - Low"
                    End If
                    vDomainRiskNote = "Pre-Assessment: " + (IIf(vDomainInterval = 3, "Domain - High; ", IIf(vDomainInterval = 2, "Domain - Medium; ", "Domain - Low; ")))
                    'call method to assign generic evaluation on domain:
                    'AssignRisk2Domain vDomainValue, vDomainRiskValue, vDomainRiskNote
                End If
            End If
            SubListArray = Split(ListArray(1), "|")
            'generic risk evaluation for area
            If InStr(SubListArray(1), "#") = 0 Then
                vAreaValue = SubListArray(1)
                vAreaRiskNote = (IIf(vItem.GetAttribute("name") = "High", "Area - High; ", IIf(vItem.GetAttribute("name") = "Medium", "Area - Medium; ", "Area - Low; ")))
                'call method to assign generic evaluation on domain/area:
                If vItem.GetAttribute("name") = "Low" Then
                    vAreaRiskValue = "1 - Low"
                ElseIf vItem.GetAttribute("name") = "Medium" Then
                    vAreaRiskValue = "2 - Medium"
                Else
                    vAreaRiskValue = "3 - High"
                End If
                AssignRisk2Plan vDomainValue, vDomainRiskNote, vAreaValue, IIf(vDomainRiskValue > vAreaRiskValue, vDomainRiskValue, vAreaRiskValue), vAreaRiskNote, ""
            Else
            'generic risk evaluation for area in plugin
                If vItem.GetAttribute("name") = "Low" Then
                    vAreaRiskValue = "1 - Low"
                ElseIf vItem.GetAttribute("name") = "Medium" Then
                    vAreaRiskValue = "2 - Medium"
                Else
                    vAreaRiskValue = "3 - High"
                End If
                PlugArray = Split(SubListArray(1), "#")
                vAreaValue = PlugArray(0)
                vAreaRiskNote = (IIf(vItem.GetAttribute("name") = "High", "Area - High; ", IIf(vItem.GetAttribute("name") = "Medium", "Area - Medium; ", "Area - Low; ")))
                'call method to assign generic evaluation on domain/area:
                AssignRisk2Plan vDomainValue, vDomainRiskNote, vAreaValue, IIf(vDomainRiskValue > vAreaRiskValue, vDomainRiskValue, vAreaRiskValue), vAreaRiskNote, PlugArray(1)
            End If
            */
            
        }

    }
    var writetofile = new XMLSerializer().serializeToString(doc);
    fs.writeFileSync(fileid, writetofile);
    return true;
};

module.exports.LoadPlanning = LoadPlanning;
module.exports.SavePlanning = SavePlanning;
module.exports.SyncPreAssessmentWithRiskAnalysis = SyncPreAssessmentWithRiskAnalysis;