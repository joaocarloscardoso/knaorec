//var portfolio = require('../lib/portfolio.js');
//replace user01 with this: req.session.passport.user
//portfolio.LoadFromDatabase(credentials.WorkSetPath + req.sessionID + '_plf.xml','Portfolio01', 'user01');
//portfolio.ListPortfolios('user01', '1').then(function(Result){
//    console.log(Result);
//});

//credentials used in the app
var credentials = require('../credentials.js');
var globalvalues = require('../globalvalues.js');

var fs = require('fs'),
    path = require('path');

//logging system
var log = require('./log.js');

//database
var database = require('./db.js');

var xpath   = require('xpath');
var Dom     = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;
var iCounter;

var Nodes = [];
var KeyNodes = [];
var Edges = [];
var Support = [];

function MapPortfolioReference(doc) {
    var vAuditTitle = '';
    var vAuditBackground = '';

    var NewNodeEntry = {
        id: 0,
        label: xpath.select("/portfolio/@id",doc)[0].nodeValue,
        title: 'Portfolio: ' + xpath.select("/portfolio/@id",doc)[0].nodeValue,
        shape: 'triangleDown',
        group: 0
    };
    vCurrentIssueId = NewNodeEntry.id;
    Nodes.push(NewNodeEntry);     

    var NewSupportEntry = {
        title: 'Portfolio: ' + xpath.select("/portfolio/@id",doc)[0].nodeValue,
        matrix: '',
        description: xpath.select("/portfolio/@description",doc)[0].nodeValue
    };
    Support.push(NewSupportEntry);        

};

function MapAuditObjects(doc, portfolioid){
    var vAuditTitle = '';
    var vAuditBackground = '';
    var vCurrentAuditId = 0;

    //audit reference section
    var vAudits = xpath.select("/portfolio/audits/Audit/About/@id",doc);
    for (var i=0; i<vAudits.length; i++) {
        if (xpath.select("boolean(/portfolio/audits/Audit/About[@id='" + vAudits[i].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@nm)",doc)){
            vAuditTitle = xpath.select("/portfolio/audits/Audit/About[@id='" + vAudits[i].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@nm",doc)[0].nodeValue
        } else {
            vAuditTitle = '';
        };
        var res = xpath.select("/portfolio/audits/Audit/About[@id='" + vAudits[i].nodeValue + "']/../Background/ak",doc);
        if (res.length==1 && res[0].firstChild != null) {
            vAuditBackground = res[0].firstChild.nodeValue;
        } else {
            vAuditBackground= '';
        }

        var NewNodeEntry = {
            id: Nodes.length,
            label: 'Audit:\n' + vAuditTitle,
            title: 'Audit: ' + vAuditTitle,
            shape: 'dot',
            group: parseInt(i+1)
        };
        vCurrentAuditId = NewNodeEntry.id;
        Nodes.push(NewNodeEntry);     

        var NewSupportEntry = {
            title: 'Audit: ' + vAuditTitle,
            //place here the url for audit recommendations specific analysis 
            matrix: '/portanalytics/audit?id=' + portfolioid + '&auditid=' + vAudits[i].nodeValue,
            description: vAuditBackground
        };
        Support.push(NewSupportEntry);        
        
        var NewKeyEntry = {
            id: vCurrentAuditId,
            nodekey: vAudits[i].nodeValue,
            group: parseInt(i+1)
        };
        KeyNodes.push(NewKeyEntry);        

        //relates edge of domain id with audit id
        var NewEdgeEntry = {
            from: 0,
            to: vCurrentAuditId
        };        
        Edges.push(NewEdgeEntry);
    };

};

function MapRecommendationObjects(doc) {
    var tempDescription = '';
    var tempTitle = '';
    var vRecommendations = xpath.select("/portfolio/audits/Audit/Recommendations/Recommendation/@nr",doc);
    var vCurrentRecommendationId = 0;
    var vCurrentAuditId = 0;
    var vCurrentGroup = 0;
    var vNumber = 0;

    for (var i=0; i<vRecommendations.length; i++) {
        if (xpath.select("/portfolio/audits/Audit/Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/quote[@type='description']/.",doc)[0].firstChild === null)
        {
            tempDescription= '';
        }else{
            tempDescription= xpath.select("/portfolio/audits/Audit/Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/quote[@type='description']/.",doc)[0].firstChild.nodeValue;
        };
        if (xpath.select("boolean(/portfolio/audits/Audit/Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@number)",doc)){
            vNumber = xpath.select("/portfolio/audits/Audit/Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@number",doc)[0].nodeValue
        } else {
            vNumber = 0;
        };        
        tempTitle = xpath.select("/portfolio/audits/Audit/Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@category",doc)[0].nodeValue;
        if (tempTitle == "(Not defined yet)" || tempTitle == ""){
            if (tempDescription.length > 0){
                tempTitle = tempDescription.substring(0, 60) + '...'
            }
        }

        var vCurrentAudit = xpath.select("/portfolio/audits/Audit/Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/../../About/@id",doc)[0].nodeValue
        var result = KeyNodes.find( ({ nodekey }) => nodekey === vCurrentAudit);
        if(result == null){ 
            vCurrentAuditId = 0;
            vCurrentGroup = 0;
        } else {
            vCurrentAuditId= result.id;
            vCurrentGroup = result.group;
        };

        //create issue and get id number
        var NewNodeEntry = {
            id: Nodes.length,
            label: 'Recommendation:\n#' + vNumber, 
            title: 'Rec. #' + vNumber +': ' + tempTitle,  
            shape: 'triangle',
            group: vCurrentGroup
        };
        vCurrentRecommendationId = NewNodeEntry.id;
        Nodes.push(NewNodeEntry);     

        var NewSupportEntry = {
            title: 'Recommendation: #' + vNumber,
            matrix: '',
            description: tempDescription
        };
        Support.push(NewSupportEntry);        
        
        var NewKeyEntry = {
            id: vCurrentRecommendationId,
            nodekey: vRecommendations[i].nodeValue,
            group: vCurrentGroup
        };
        KeyNodes.push(NewKeyEntry);        

        var NewEdgeEntry = {
            from: vCurrentAuditId,
            to: vCurrentRecommendationId
        };        
        Edges.push(NewEdgeEntry);        
    };
};

function LoadAuditRecommendations(doc, auditid) {
    Catalog = [];
    tempDescription = '';
    tempTimeline ='';
    tempStatus='';
    tempFindings=[];
    vNumber=0;
    vFindingNumber = 0;
    vFindingDescription = '';
    vFindingName = '';

    iCounter = 0;
    var vRecommendations = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation/@nr",doc);

    for (var i=0; i<vRecommendations.length; i++) {
        if (xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/quote[@type='description']/.",doc)[0].firstChild === null)
        {
            tempDescription= '';
        }else{
            tempDescription= xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/quote[@type='description']/.",doc)[0].firstChild.nodeValue;
        };
        if (xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/quote[@type='timeline']/.",doc)[0].firstChild === null)
        {
            tempTimeline= '';
        }else{
            tempTimeline= xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/quote[@type='timeline']/.",doc)[0].firstChild.nodeValue;
        };
        if (xpath.select("boolean(/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@number)",doc)){
            vNumber = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@number",doc)[0].nodeValue
        } else {
            vNumber = 0;
        };

        var vMonitoring = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/monitoring/assessment/@date",doc);
        if (vMonitoring.length > 0) {
            tempStatus=xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/monitoring/assessment[@date='" + vMonitoring[(vMonitoring.length-1)].nodeValue + "']/@status",doc)[0].nodeValue;
        } else {
            tempStatus='(not yet accessed)';
        };

        tempFindings=[];
        var vColFindings = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/findings/finding/@nr",doc);
        for (var jF=0; jF<vColFindings.length; jF++) {
            vFindingName = '';
            if (xpath.select("boolean(/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vColFindings[jF].nodeValue + "']/@number)",doc)){
                vFindingNumber = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vColFindings[jF].nodeValue + "']/@number",doc)[0].nodeValue
            } else {
                vFindingNumber = 0;
            };
            if (typeof xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vColFindings[jF].nodeValue + "']/quote[@type='description']/.",doc)[0] !== 'undefined'){
                if (xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vColFindings[jF].nodeValue + "']/quote[@type='description']/.",doc)[0].firstChild === null)
                {
                    vFindingDescription= '';
                }else{
                    vFindingDescription= xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vColFindings[jF].nodeValue + "']/quote[@type='description']/.",doc)[0].firstChild.nodeValue;
                };
            } else {
                vFindingDescription= '';
            }
            if (xpath.select("boolean(/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vColFindings[jF].nodeValue + "']/@nm)",doc)){
                vFindingName = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vColFindings[jF].nodeValue + "']/@nm",doc)[0].nodeValue
            };
    
            var NewEntry={
                Number: '#' + vFindingNumber,
                Name: vFindingName,
                Description: vFindingDescription
            };
            tempFindings.push(NewEntry);
        };

        var NewEntry = {
            RowId: '#' + String((iCounter+1)),
            Id: vRecommendations[i].nodeValue,
            Description: tempDescription,
            Number: vNumber,
            Priority: xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@priority",doc)[0].nodeValue,
            Risk: xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@risk",doc)[0].nodeValue,
            Riskevaluation: xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@riskevaluation",doc)[0].nodeValue,
            Repeated: xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@repeated",doc)[0].nodeValue,
            Timeline: tempTimeline,
            Status: tempStatus,
            Findings: tempFindings
        };
        Catalog.push(NewEntry);        
        iCounter++;   
    }
    return Catalog;
};

function LoadRecPriorities(doc, auditid) {
    //var ColPriorities =  globalvalues.Recommendation.Priority.split("|");
    var CatPriorities = [];
    //for (index = 0, SelPrioritiesLen = (ColPriorities.length); index < SelPrioritiesLen; ++index) {
    //    var NewEntry = {
    //        Priority: ColPriorities[index],
    //        Number: 0
    //    };
    //    CatPriorities.push(NewEntry);
    //};

    var vRecommendations = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation/@nr",doc);
    for (var i=0; i<vRecommendations.length; i++) {
        var tempDescription = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@priority",doc)[0].nodeValue;
        if (tempDescription =='')
        {
            tempDescription = 'Regular'
        };
        if (
            CatPriorities.some(Node => 
                Node.Priority === tempDescription
            )) {
                CatPriorities.find(Node => 
                    Node.Priority === tempDescription
                ).Number = CatPriorities.find( Node => 
                    Node.Priority === tempDescription
                ).Number + 1;
            } else {
                var NewEntry = {
                    Priority: tempDescription,
                    Number: 1
                };
                CatPriorities.push(NewEntry);        
            }
    };
    return CatPriorities;
};

function LoadRecCharacterization(doc, auditid) {
    //var ColCharacterization =  globalvalues.Recommendation.RiskCharacterization.split("|");
    var CatCharacterization = [];
    //for (index = 0, SelCharacterizationLen = (ColCharacterization.length); index < SelCharacterizationLen; ++index) {
    //    var NewEntry = {
    //        Risk: ColCharacterization[index],
    //        Number: 0
    //    };
    //    CatCharacterization.push(NewEntry);
    //};

    var vRecommendations = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation/@nr",doc);
    for (var i=0; i<vRecommendations.length; i++) {
        var tempDescription = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@risk",doc)[0].nodeValue
        if (tempDescription =='')
        {
            tempDescription = 'not defined'
        };
        if (
            CatCharacterization.some(Node => 
                Node.Risk === tempDescription
            )) {
                CatCharacterization.find(Node => 
                    Node.Risk === tempDescription
                ).Number = CatCharacterization.find( Node => 
                    Node.Risk === tempDescription
                ).Number + 1;
            } else {
                var NewEntry = {
                    Risk: tempDescription,
                    Number: 1
                };
                CatCharacterization.push(NewEntry);        
            }
    };
    return CatCharacterization;
};

function LoadRecImportance(doc, auditid) {
    var ColImportance =  globalvalues.Recommendation.Importance.split("|");
    var CatImportance = [];
    for (index = 0, SelImportanceLen = (ColImportance.length); index < SelImportanceLen; ++index) {
        var NewEntry = {
            Importance: ColImportance[index],
            Number: 0
        };
        CatImportance.push(NewEntry);
    };

    var vRecommendations = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation/@nr",doc);
    for (var i=0; i<vRecommendations.length; i++) {
        if (
            CatImportance.some(Node => 
                Node.Importance === xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@importance",doc)[0].nodeValue
            )) {
                CatImportance.find(Node => 
                    Node.Importance === xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@importance",doc)[0].nodeValue
                ).Number = CatImportance.find( Node => 
                    Node.Importance === xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@importance",doc)[0].nodeValue
                ).Number + 1;
            }
    };
    return CatImportance;
};

function LoadRecLevel(doc, auditid) {
    //var ColLevel =  globalvalues.Recommendation.RiskEvaluation.split("|");
    var CatLevel = [];
    //for (index = 0, SelLevelLen = (ColLevel.length); index < SelLevelLen; ++index) {
    //    var NewEntry = {
    //        Level: ColLevel[index],
    //        Number: 0
    //    };
    //    CatLevel.push(NewEntry);
    //};

    var vRecommendations = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation/@nr",doc);
    for (var i=0; i<vRecommendations.length; i++) {
        var tempDescription = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@riskevaluation",doc)[0].nodeValue;
        if (tempDescription =='')
        {
            tempDescription = 'not defined'
        };
        if (
            CatLevel.some(Node => 
                Node.Level === tempDescription
            )) {
                CatLevel.find(Node => 
                    Node.Level === tempDescription
                ).Number = CatLevel.find( Node => 
                    Node.Level === tempDescription
                ).Number + 1;
            } else {
                var NewEntry = {
                    Level: tempDescription,
                    Number: 1
                };
                CatLevel.push(NewEntry);        
            }
    };
    return CatLevel;
};

function LoadAuditRecommendationsForAnalysis(doc, auditid, sellang) {
    var tempTitle='';
    var tempBackground ='';
    var tempScope ='';
    var tempRef='';
    var tempNumber=0;
    var tempNew=0;
    var tempPart=0;

    var colStatus =  JSON.parse('{"not_yet_accessed":0}');
    var colRepeated = JSON.parse('{}');
    var colStatusLabel =  'not yet accessed';
    var colRepeatedLabel = '';
    var colStatusTemp =  '';
    var colRepeatedTemp = '';
    var tempStatus = '';

    //audit reference section
    tempRef = auditid;
    var res = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/title/tx[@l='" + sellang + "']/@nm",doc);
    if (res.length==1 && res[0] != null){
        tempTitle = res[0].nodeValue;
    } else {
        res = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/title/tx[@l='" + credentials.WorkLang + "']/@nm",doc);
        if (res.length==1 && res[0] != null){
            tempTitle = res[0].nodeValue;
        } else {
            tempTitle = '';
        };
    };
    var res = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Background/ak[@l='" + sellang + "']/.",doc);
    if (res.length==1 && res[0].firstChild != null)
        tempBackground = res[0].firstChild.nodeValue;

    var res = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Scope/ak[@l='" + sellang + "']/.",doc);
    if (res.length==1 && res[0].firstChild != null)
        tempScope = res[0].firstChild.nodeValue;

    var List  = {
        AuditReference: tempRef,
        AuditTitle: tempTitle,
        AuditBackground: tempBackground,
        AuditScope: tempScope,
        StatPriorities: LoadRecPriorities(doc, auditid),
        StatCharacterization: LoadRecCharacterization(doc, auditid),
        //StatImportance: LoadRecImportance(doc, auditid),
        StatLevel: LoadRecLevel(doc, auditid),
        Recommendations: LoadAuditRecommendations(doc, auditid),
        NumberOfRecommendations: 0,
        NumberOfNewRecommendations: 0,
        NumberOfRepRecommendations: 0,
        NumberOfPartRecommendations: 0,
        repeated_data: [],
        repeated_label: '',
        status_label: '',
        StatStatus: []
    };
    List.NumberOfRecommendations = List.Recommendations.length;
    for (var j = 0; j < List.Recommendations.length; j++){
        tempStatus=List.Recommendations[j].Repeated;
        if (tempStatus == ''){
            tempStatus='not defined';
        };     
        if (colRepeatedLabel.search(tempStatus) < 0){
            if (colRepeatedLabel == ''){
                colRepeatedLabel=tempStatus;
                tempStatus=tempStatus.split("/").join("__");
                tempStatus=tempStatus.split(" ").join("_");
                colRepeatedTemp = JSON.stringify(colRepeated);
                colRepeatedTemp='{"' + tempStatus + '":0}';
            } else {
                colRepeatedLabel=colRepeatedLabel + '|' + tempStatus;
                tempStatus=tempStatus.split("/").join("__");
                tempStatus=tempStatus.split(" ").join("_");
                colRepeatedTemp = JSON.stringify(colRepeated);
                colRepeatedTemp=colRepeatedTemp.replace('}', ', "' + tempStatus + '":0}');
            };
            colRepeated=JSON.parse(colRepeatedTemp);
        } else {
            tempStatus=tempStatus.split("/").join("__");
            tempStatus=tempStatus.split(" ").join("_");    
        };  
        colRepeated[tempStatus]=colRepeated[tempStatus] + 1;
    };
    List.repeated_label=colRepeatedLabel;
    List.repeated_data=colRepeated;
    //List.NumberOfNewRecommendations = tempNew;
    //List.NumberOfPartRecommendations = tempPart;
    //List.NumberOfRepRecommendations = (parseInt(List.NumberOfRecommendations) - parseInt(List.NumberOfNewRecommendations) - parseInt(List.NumberOfPartRecommendations))

    //var ColStatus =  globalvalues.Recommendation.ImplementationStatus.split("|");
    //for (index = 0; index < ColStatus.length; ++index) {
    //    tempNumber=0;
    //    for (var j = 0; j < List.Recommendations.length; j++){
    //        // look for the entry with a matching `code` value
    //        if (List.Recommendations[j].Status == ColStatus[index]){
    //            tempNumber=tempNumber+1;
    //        }
    //    }
    //    var NewEntry = {
    //        Status: ColStatus[index],
    //        Number: tempNumber
    //    };
    //    List.StatStatus.push(NewEntry);
    //}

    for (var j = 0; j < List.Recommendations.length; j++){
        tempStatus=List.Recommendations[j].Status;
        if (tempStatus != ''){
            if (colStatusLabel.search(tempStatus) < 0){
                if (colStatusLabel == ''){
                    colStatusLabel=tempStatus;
                    tempStatus=tempStatus.split("/").join("__");
                    tempStatus=tempStatus.split(" ").join("_");
                    //colStatusTemp = JSON.stringify(colStatus);
                    colStatusTemp=colStatusTemp.replace('}', ', {"' + tempStatus + '":0}');
                } else {
                    colStatusLabel=colStatusLabel + '|' + tempStatus;
                    tempStatus=tempStatus.split("/").join("__");
                    tempStatus=tempStatus.split(" ").join("_");
                    colStatusTemp = JSON.stringify(colStatus);
                    colStatusTemp=colStatusTemp.replace('}', ', "' + tempStatus + '":0}');
                };
                colStatus=JSON.parse(colStatusTemp);
            } else {
                tempStatus=tempStatus.split("/").join("__");
                tempStatus=tempStatus.split(" ").join("_");    
            };  
        }else{
            tempStatus='not_yet_accessed';
        };        
        colStatus[tempStatus]=colStatus[tempStatus] + 1;
    };
    List.status_label=colStatusLabel;
    List.StatStatus=colStatus;

    return List;
};

function DeleteAuditFromPortfolio(id, auditid, userid) {
    var dbfields = { data: 1 };

    var sortfields = {"datepub": -1};
    return new Promise(function(resolve, reject){
        database.QueryDataByID(id, dbfields, sortfields).then(function(Result){
            var doc = new Dom().parseFromString(Result[0].data);
            var vItems = xpath.select("/portfolio/audits/.",doc);
            vItem2Delete = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/..",doc);
            console.log(vItem2Delete[0]);
            vItems[0].removeChild(vItem2Delete[0]);
            var datadb = new XMLSerializer().serializeToString(doc);
            var Portfolio = { $set: 
                {
                    data: datadb
                }
            };

            var portfolioId=xpath.select("/portfolio/@id",doc);
            var dbparams = {userid: userid,
                portfolioid: portfolioId,
                auditid: vItem2Delete
            };
            database.DeleteDataAudit(dbparams);     

            database.UpdateData(userid, id, Portfolio).then(function(Result){
                resolve(Result);
            });
        });
    });
};

function AddAuditToPortfolio(id, AuditFileAttach, userid) {
    var dbfields = { data: 1 };

    var sortfields = {"datepub": -1};

    return new Promise(function(resolve, reject){
        database.QueryDataByID(id, dbfields, sortfields).then(function(Result){
            //NewAuditdata is a string
            var NewAuditdata = fs.readFileSync(AuditFileAttach, { encoding : 'UTF-8' });
            var NewAuditdoc = new Dom().parseFromString(NewAuditdata);
            var doc = new Dom().parseFromString(Result[0].data);

            //check if audit already exists
            var NewRefId = xpath.select("/Audit/About/@id",NewAuditdoc);
            if (xpath.select("boolean(/portfolio/audits/Audit/About[@id='" + NewRefId[0].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@nm)",doc)){
                var vError = [  
                    {msg: 'The selected audit was not attached to the portfolio!'},
                    {msg: 'An audit with reference #' + NewRefId[0].nodeValue + ' is already present in portfolio!'}
                ];
                resolve(vError);
            } else {
                //select portfolio audits and selected audit to join root node
                var PortfolioRoot = xpath.select("/portfolio/audits/.",doc);
                var NewAuditNode = xpath.select("/Audit",NewAuditdoc);
                //insert audit root node in XML portfolio file
                PortfolioRoot[0].appendChild(NewAuditNode[0]);
                var datadb = new XMLSerializer().serializeToString(doc);

                var portfolioId=xpath.select("/portfolio/@id",doc);
                var AuditNew = {
                    userid: userid,
                    portfolioid: portfolioId,
                    auditid: NewAuditNode,
                    data: datadb
                };
                database.InsertDataAudit(AuditNew);     

                var Portfolio = { $set: 
                    {
                        data: datadb
                    }
                };

                database.UpdateData(userid, id, Portfolio).then(function(Result){
                    resolve(Result);
                });
            };
        });
    });
};

function DeletePortfolio(portfolioid, userid) {
    var dbparams = {userid: userid,
        portfolioid: portfolioid
    }

    database.DeleteData(dbparams);
    database.DeleteDataAudit(dbparams);     

    return true;
};

function UpdatePortfolio(id, data, userid) {
    var dbfields = { data: 1 };

    var sortfields = {"datepub": -1};

    return new Promise(function(resolve, reject){
        database.QueryDataByID(id, dbfields, sortfields).then(function(Result){
            var doc = new Dom().parseFromString(Result[0].data);
            var portdata = xpath.select("/portfolio/.",doc);
            portdata[0].setAttribute('id', data.portfolioid);
            portdata[0].setAttribute('description',data.description);
            portdata[0].setAttribute('coverage',data.coverage);
            portdata[0].setAttribute('org',data.org);
            portdata[0].setAttribute('publisb',data.publish);
            var datadb = new XMLSerializer().serializeToString(doc);

            var Portfolio = { $set: 
                {
                    userid: userid,
                    datepub: (new Date()).toJSON(),
                    portfolioid: data.portfolioid,
                    description: data.description,
                    coverage: data.coverage,
                    org: data.org,
                    publish: data.publish,
                    data: datadb
                }
            };

            database.UpdateData(userid, id, Portfolio).then(function(Result){
                resolve(Result);
            });
        });
    });
};

function CreatePortfolio(data, userid) {
    var Portfolio = {
        userid: userid,
        datepub: (new Date()).toJSON(),
        portfolioid: data.portfolioid,
        description: data.description,
        coverage: data.coverage,
        org: data.org,
        publish: data.publish,
        data: '<?xml version="1.0" encoding="UTF-8"?><portfolio id="' + data.portfolioid + '" description="' + data.description + '" coverage="' + data.coverage + '" org="' + data.org + '" publish="' + data.publish + '"><audits></audits></portfolio>'
    };
    return new Promise(function(resolve, reject){
        database.InsertData(Portfolio).then(function(Result){
            resolve(Result);
        });
    });
};

function LoadPortfolioAudit(portfolioid, auditid, sellang){
    var dbfields = { _id: 0, data: 1 };

    var sortfields = {"datepub": -1};

    return new Promise(function(resolve, reject){
        database.QueryDataByID(portfolioid, dbfields, sortfields).then(function(Result){
            var doc = new Dom().parseFromString(Result[0].data);
            var Catalog = LoadAuditRecommendationsForAnalysis(doc, auditid, sellang);
            resolve(Catalog);
        });
    });

};

function LoadSearchAudit(id, auditid, sellang){
    var dbparams =  { portfolioid: id };
    var dbfields = { _id: 0, data: 1 };

    var sortfields = {"auditid": -1};

    return new Promise(function(resolve, reject){
        database.QueryData(dbparams, dbfields, sortfields).then(function(Result){
            var doc = new Dom().parseFromString(Result[0].data);
            var Catalog = LoadAuditRecommendationsForAnalysis(doc, auditid, sellang);
            resolve(Catalog);
        });
    });

};

//get portfolio aggregated overview
function LoadPortfolioOverview(portfolioid, sellang) {
    var dbfields = { _id: 0, portfolioid: 1, description: 1, coverage: 1, org: 1, data: 1, publish: 1 };

    var sortfields = {"datepub": -1};

    return new Promise(function(resolve, reject){
        database.QueryDataByID(portfolioid, dbfields, sortfields).then(function(Result){
            var doc = new Dom().parseFromString(Result[0].data);
            var index = 0;
            var vRecommendations = xpath.select("/portfolio/audits/Audit/Recommendations/Recommendation/@nr",doc);
            //var colStatus =  JSON.parse('{"' + globalvalues.Recommendation.ImplementationStatus.split(" ").join("_").split("|").join('": 0, "') + '": 0, "not_yet_accessed": 0}');
            //var colRepeated = JSON.parse('{"No": 0, "Yes": 0, "Partially": 0}');
            //var colRisk =  JSON.parse('{"' + globalvalues.Recommendation.RiskCharacterization.split(" ").join("_").split("|").join('": 0, "') + '": 0}');
            var colStatus =  JSON.parse('{"not_yet_accessed":0}');
            var colRepeated = JSON.parse('{}');
            var colRisk =  JSON.parse('{}');
            var colStatusLabel =  'not yet accessed';
            var colRepeatedLabel = '';
            var colRiskLabel =  '';
            var colStatusTemp =  '';
            var colRepeatedTemp = '';
            var colRiskTemp =  '';
            
            for (var i=0; i<vRecommendations.length; i++) {
                var vMonitoring = xpath.select("/portfolio/audits/Audit/Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/monitoring/assessment/@date",doc);
                if (vMonitoring.length > 0) {
                    tempStatus=xpath.select("/portfolio/audits/Audit/Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/monitoring/assessment[@date='" + vMonitoring[(vMonitoring.length-1)].nodeValue + "']/@status",doc)[0].nodeValue;
                    if (tempStatus != ''){
                        if (colStatusLabel.search(tempStatus) < 0){
                            if (colStatusLabel == ''){
                                colStatusLabel=tempStatus;
                                tempStatus=tempStatus.split("/").join("__");
                                tempStatus=tempStatus.split(" ").join("_");
                                //colStatusTemp = JSON.stringify(colStatus);
                                colStatusTemp=colStatusTemp.replace('}', ', {"' + tempStatus + '":0}');
                            } else {
                                colStatusLabel=colStatusLabel + '|' + tempStatus;
                                tempStatus=tempStatus.split("/").join("__");
                                tempStatus=tempStatus.split(" ").join("_");
                                colStatusTemp = JSON.stringify(colStatus);
                                colStatusTemp=colStatusTemp.replace('}', ', "' + tempStatus + '":0}');
                            };
                            colStatus=JSON.parse(colStatusTemp);
                        } else {
                            tempStatus=tempStatus.split("/").join("__");
                            tempStatus=tempStatus.split(" ").join("_");    
                        };  
                    }else{
                        tempStatus='not_yet_accessed';
                    };        
                } else {
                    tempStatus='not_yet_accessed';
                };
                colStatus[tempStatus]=colStatus[tempStatus] + 1;

                tempStatus = xpath.select("/portfolio/audits/Audit/Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@repeated",doc)[0].nodeValue;
                if (tempStatus == ''){
                    tempStatus='not defined';
                };     
                if (colRepeatedLabel.search(tempStatus) < 0){
                    if (colRepeatedLabel == ''){
                        colRepeatedLabel=tempStatus;
                        tempStatus=tempStatus.split("/").join("__");
                        tempStatus=tempStatus.split(" ").join("_");
                        colRepeatedTemp = JSON.stringify(colRepeated);
                        colRepeatedTemp='{"' + tempStatus + '":0}';
                    } else {
                        colRepeatedLabel=colRepeatedLabel + '|' + tempStatus;
                        tempStatus=tempStatus.split("/").join("__");
                        tempStatus=tempStatus.split(" ").join("_");
                        colRepeatedTemp = JSON.stringify(colRepeated);
                        colRepeatedTemp=colRepeatedTemp.replace('}', ', "' + tempStatus + '":0}');
                    };
                    colRepeated=JSON.parse(colRepeatedTemp);
                } else {
                    tempStatus=tempStatus.split("/").join("__");
                    tempStatus=tempStatus.split(" ").join("_");    
                };  
                colRepeated[tempStatus]=colRepeated[tempStatus] + 1;

                tempStatus = xpath.select("/portfolio/audits/Audit/Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@risk",doc)[0].nodeValue;
                if (tempStatus == ''){
                    tempStatus='not defined';
                };     
                if (colRiskLabel.search(tempStatus) < 0){
                    if (colRiskLabel == ''){
                        colRiskLabel=tempStatus;
                        tempStatus=tempStatus.split("/").join("__");
                        tempStatus=tempStatus.split(" ").join("_");
                        colRiskTemp = JSON.stringify(colRisk);
                        colRiskTemp='{"' + tempStatus + '":0}';
                    } else {
                        colRiskLabel=colRiskLabel + '|' + tempStatus;
                        tempStatus=tempStatus.split("/").join("__");
                        tempStatus=tempStatus.split(" ").join("_");
                        colRiskTemp = JSON.stringify(colRisk);
                        colRiskTemp=colRiskTemp.replace('}', ', "' + tempStatus + '":0}');
                    };
                    colRisk=JSON.parse(colRiskTemp);
                } else {
                    tempStatus=tempStatus.split("/").join("__");
                    tempStatus=tempStatus.split(" ").join("_");    
                };  
                colRisk[tempStatus]=colRisk[tempStatus] + 1;
            };

            var colAudits=[];
            var vAudits = xpath.select("/portfolio/audits/Audit/About/@id",doc);
            for (var i=0; i<vAudits.length; i++) {
                var NewEntry = {
                    PortfolioId: portfolioid,
                    AuditId: vAudits[i].nodeValue,
                    Title: '',
                    Background:'',
                };
                var res = xpath.select("/portfolio/audits/Audit/About[@id='" + vAudits[i].nodeValue + "']/title/tx[@l='" + sellang + "']/@nm",doc);
                if (res.length==1 && res[0] != null){
                    NewEntry.Title = res[0].nodeValue;
                } else {
                    res = xpath.select("/portfolio/audits/Audit/About[@id='" + vAudits[i].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@nm",doc);
                    if (res.length==1 && res[0] != null){
                        NewEntry.Title = res[0].nodeValue;
                    } else {
                        NewEntry.Title = '';
                    };
                };
                var res = xpath.select("/portfolio/audits/Audit/About[@id='" + vAudits[i].nodeValue + "']/../Background/ak",doc);
                if (res.length==1 && res[0].firstChild != null)
                    NewEntry.Background = res[0].firstChild.nodeValue;
                colAudits.push(NewEntry);
            };

            Nodes = [];
            KeyNodes = [];
            Edges = [];
            Support = [];
        
            //MapPortfolioReference(doc);
            //MapAuditObjects(doc, portfolioid);
            //MapRecommendationObjects(doc);
            var PortfolioMap = {
                support: Support,
                nodes: Nodes,
                edges: Edges
            };

            var doc1 = new Dom().parseFromString(Result[0].description);
            var Catalog = {
                _id: portfolioid,
                portfolioid: Result[0].portfolioid,
                name: xpath.select("/name/tx[@l='" + credentials.WorkLang + "']/@nm",doc1)[0].nodeValue,
                description: xpath.select("/name/tx[@l='" + credentials.WorkLang + "']/@description",doc1)[0].nodeValue,
                coverage: Result[0].coverage,
                org: Result[0].org,
                publish: Result[0].publish,
                status_data: colStatus,
                status_label: colStatusLabel,       //globalvalues.Recommendation.ImplementationStatus + "|not yet accessed",
                repeated_data: colRepeated,
                repeated_label: colRepeatedLabel,   //'New|Repeated|Partially',
                risk_data: colRisk,
                risk_label: colRiskLabel,           //globalvalues.Recommendation.RiskCharacterization,
                audits: colAudits,
                portfoliomap: PortfolioMap
            };
            resolve(Catalog);
        });
    });

};

//get list of portfolios: from database
function ListPortfolios(userid, published) {
    var dbparams = {};
    if (published == '1') {
        // if (userid == ''){
            dbparams = { publish: published };
        //} else {
        //    dbparams = { userid: userid,
        //        publish: published
        //    };
        //};   
    } else {
        dbparams = { userid: userid };
    };

    var dbfields = { _id: 1, userid: 1, datepub: 1, portfolioid: 1, description: 1, coverage: 1, org: 1, publish: 1 };
    var sortfields = {"datepub": -1};

    return new Promise(function(resolve, reject){
        database.QueryData(dbparams, dbfields, sortfields).then(function(Result){
            var colPortfolios=[];
            for (var i=0; i<Result.length; i++) {
                var doc = new Dom().parseFromString(Result[i].description);
                var NewEntry = {
                    _id: Result[i]._id,
                    userid: Result[i].userid,
                    datepub: Result[i].datepub,
                    portfolioid: Result[i].portfolioid,
                    name: xpath.select("/name/tx[@l='" + credentials.WorkLang + "']/@nm",doc)[0].nodeValue,
                    description: xpath.select("/name/tx[@l='" + credentials.WorkLang + "']/@description",doc)[0].nodeValue,
                    coverage: Result[i].coverage,
                    org: Result[i].org,
                    publish: Result[i].publish
                };
                colPortfolios.push(NewEntry);
            };
            resolve(colPortfolios);
        });
    });
};

//get list of portfolios: from database
function ListPortfoliosFromUser(userid) {
    var dbparams = {};
    dbparams = { userid: userid };

    var dbfields = { _id: 1, userid: 1, datepub: 1, portfolioid: 1, description: 1, coverage: 1, org: 1, publish: 1 };
    var sortfields = {"datepub": -1};

    return new Promise(function(resolve, reject){
        database.QueryData(dbparams, dbfields, sortfields).then(function(Result){
            resolve(Result);
        });
    });
};

//get list of portfolios: from database
function ListPortfolioBasic(portfolioid) {
    var dbfields = { _id: 1, userid: 1, portfolioid: 1, description: 1, coverage: 1, org: 1 };
    var sortfields = {"datepub": -1};

    return new Promise(function(resolve, reject){
        database.QueryDataByID(portfolioid, dbfields, sortfields).then(function(Result){
            resolve(Result[0]);
        });
    });
};

//get portfolio aggregated overview
function LoadNewPortfolioOverview() {
    var Catalog = {
        _id: 'New',
        portfolioid: '',
        description: '',
        coverage: '',
        org: '',
        publish: 0,
        status_data: [],
        status_label: '',
        repeated_data: [],
        repeated_label: '',
        risk_data: [],
        risk_label: '',
        audits: [],
        portfoliomap: []
    };
    return Catalog;
};

function Search(SearchExpr) {
    var dbQuery = {$text: {$search: SearchExpr }};
    var dbfields = { _id: 1, auditid:1, portfolioid:1, recid:1, about:1, background:1, scope:1, data:1, score:{$meta: "textScore"} };
    var sortfields = {score: { $meta: "textScore" }};

    //console.log(SearchExpr);
    //console.log(dbQuery);
    return new Promise(function(resolve, reject){
        database.QueryDataAudits(dbQuery, dbfields, sortfields).then(function(Result){
            var colAudits=[];
            for (var i=0; i<Result.length; i++) {
                var doc = new Dom().parseFromString(Result[i].data);
                var NewEntry = {
                    _id: Result[i]._id,
                    PortfolioId: Result[i].portfolioid,
                    AuditId: Result[i].auditid,
                    RecId: Result[i].recid,
                    Recommendation:'',
                    //importance: xpath.select("/Recommendation/@importance",doc)[0].nodeValue,
                    priority: xpath.select("/Recommendation/@priority",doc)[0].nodeValue,
                    riskarea: xpath.select("/Recommendation/@risk",doc)[0].nodeValue, 
                    level: xpath.select("/Recommendation/@riskevaluation",doc)[0].nodeValue,
                    repeated: xpath.select("/Recommendation/@repeated",doc)[0].nodeValue,
                    status:'',
                    AuditTitle: '',
                    AuditYear:'',
                    AuditBackground: '',
                    AuditScope:'',
                    Score: Result[i].score
                };
                if (xpath.select("/Recommendation[@nr='" + Result[i].recid + "']/quote[@type='description']/.",doc)[0].firstChild === null)
                {
                    NewEntry.Recommendation= '';
                }else{
                    NewEntry.Recommendation= xpath.select("/Recommendation[@nr='" + Result[i].recid + "']/quote[@type='description']/.",doc)[0].firstChild.nodeValue;
                };
                var vMonitoring = xpath.select("/Recommendation[@nr='" + Result[i].recid + "']/monitoring/assessment/@date",doc);
                if (vMonitoring.length > 0) {
                    if (typeof xpath.select("/Recommendation[@nr='" + Result[i].recid + "']/../monitoring/assessment[@date='" + vMonitoring[(vMonitoring.length-1)].nodeValue + "']/@status",doc)[0] !== 'undefined'){
                        tempStatus=xpath.select("/Recommendation[@nr='" + Result[i].recid + "']/../monitoring/assessment[@date='" + vMonitoring[(vMonitoring.length-1)].nodeValue + "']/@status",doc)[0].nodeValue;
                        NewEntry.status=tempStatus.split(" ").join("_");
                    } else {
                        NewEntry.status='not yet accessed';
                    }
                } else {
                    NewEntry.status='not yet accessed';
                };

                doc = new Dom().parseFromString(Result[i].about);
                res = xpath.select("/About/title/tx[@l='" + credentials.WorkLang + "']/@nm",doc);
                if (res.length==1 && res[0] != null){
                    NewEntry.AuditTitle = res[0].nodeValue;
                } else {
                    res = xpath.select("/About/title/tx[@l='" + credentials.WorkLang + "']/@name",doc);
                    if (res.length==1 && res[0] != null){
                        NewEntry.AuditTitle = res[0].nodeValue;
                    } else {
                        NewEntry.AuditTitle = '';
                    };
                };
                NewEntry.AuditYear = xpath.select("/About/@yearCovered",doc)[0].nodeValue;

                doc = new Dom().parseFromString(Result[i].background);
                res = xpath.select("/Background/ak",doc);
                if (res.length==1 && res[0].firstChild != null)
                    NewEntry.AuditBackground = res[0].firstChild.nodeValue;

                doc = new Dom().parseFromString(Result[i].scope);
                res = xpath.select("/Scope/ak",doc);
                if (res.length==1 && res[0].firstChild != null)
                    NewEntry.AuditScope = res[0].firstChild.nodeValue;

                colAudits.push(NewEntry);    

            };
            resolve(colAudits);
        });
    });
};

//get portfolio aggregated overview
function SearchPortfolioOverview(portfolioid, sellang) {
    var dbparams = {};
    dbparams = { portfolioid: portfolioid };
    var dbfields = { _id: 0, portfolioid: 1, description: 1, coverage: 1, org: 1, data: 1, publish: 1 };

    var sortfields = {"datepub": -1};

    return new Promise(function(resolve, reject){
        database.QueryData(dbparams, dbfields, sortfields).then(function(Result){
            var doc = new Dom().parseFromString(Result[0].data);
            var index = 0;
            //var colStatus =  JSON.parse('{"' + globalvalues.Recommendation.ImplementationStatus.split(" ").join("_").split("|").join('": 0, "') + '": 0, "not_yet_accessed": 0}');
            var vRecommendations = xpath.select("/portfolio/audits/Audit/Recommendations/Recommendation/@nr",doc);
            //var colRepeated = JSON.parse('{"No": 0, "Yes": 0, "Partially": 0}');
            //var colRisk =  JSON.parse('{"' + globalvalues.Recommendation.RiskCharacterization.split(" ").join("_").split("|").join('": 0, "') + '": 0}');

            var colStatus =  JSON.parse('{"not_yet_accessed":0}');
            var colRepeated = JSON.parse('{}');
            var colRisk =  JSON.parse('{}');
            var colStatusLabel =  'not yet accessed';
            var colRepeatedLabel = '';
            var colRiskLabel =  '';
            var colStatusTemp =  '';
            var colRepeatedTemp = '';
            var colRiskTemp =  '';

            for (var i=0; i<vRecommendations.length; i++) {
                var vMonitoring = xpath.select("/portfolio/audits/Audit/Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/monitoring/assessment/@date",doc);
                if (vMonitoring.length > 0) {
                    if (typeof xpath.select("/portfolio/audits/Audit/Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/../monitoring/assessment[@date='" + vMonitoring[(vMonitoring.length-1)].nodeValue + "']/@status",doc)[0] !== 'undefined'){
                        tempStatus=xpath.select("/portfolio/audits/Audit/Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/../monitoring/assessment[@date='" + vMonitoring[(vMonitoring.length-1)].nodeValue + "']/@status",doc)[0].nodeValue;
                    } else {
                        tempStatus='';
                    };
                    if (tempStatus != ''){
                        if (colStatusLabel.search(tempStatus) < 0){
                            if (colStatusLabel == ''){
                                colStatusLabel=tempStatus;
                                tempStatus=tempStatus.split("/").join("__");
                                tempStatus=tempStatus.split(" ").join("_");
                                //colStatusTemp = JSON.stringify(colStatus);
                                colStatusTemp=colStatusTemp.replace('}', ', {"' + tempStatus + '":0}');
                            } else {
                                colStatusLabel=colStatusLabel + '|' + tempStatus;
                                tempStatus=tempStatus.split("/").join("__");
                                tempStatus=tempStatus.split(" ").join("_");
                                colStatusTemp = JSON.stringify(colStatus);
                                colStatusTemp=colStatusTemp.replace('}', ', "' + tempStatus + '":0}');
                            };
                            colStatus=JSON.parse(colStatusTemp);
                        } else {
                            tempStatus=tempStatus.split("/").join("__");
                            tempStatus=tempStatus.split(" ").join("_");    
                        };  
                    }else{
                        tempStatus='not_yet_accessed';
                    };        
                } else {
                    tempStatus='not_yet_accessed';
                };
                colStatus[tempStatus]=colStatus[tempStatus] + 1;

                tempStatus = xpath.select("/portfolio/audits/Audit/Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@repeated",doc)[0].nodeValue;
                if (tempStatus == ''){
                    tempStatus='not defined';
                };     
                if (colRepeatedLabel.search(tempStatus) < 0){
                    if (colRepeatedLabel == ''){
                        colRepeatedLabel=tempStatus;
                        tempStatus=tempStatus.split("/").join("__");
                        tempStatus=tempStatus.split(" ").join("_");
                        colRepeatedTemp = JSON.stringify(colRepeated);
                        colRepeatedTemp='{"' + tempStatus + '":0}';
                    } else {
                        colRepeatedLabel=colRepeatedLabel + '|' + tempStatus;
                        tempStatus=tempStatus.split("/").join("__");
                        tempStatus=tempStatus.split(" ").join("_");
                        colRepeatedTemp = JSON.stringify(colRepeated);
                        colRepeatedTemp=colRepeatedTemp.replace('}', ', "' + tempStatus + '":0}');
                    };
                    colRepeated=JSON.parse(colRepeatedTemp);
                } else {
                    tempStatus=tempStatus.split("/").join("__");
                    tempStatus=tempStatus.split(" ").join("_");    
                };  
                colRepeated[tempStatus]=colRepeated[tempStatus] + 1;

                tempStatus = xpath.select("/portfolio/audits/Audit/Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@risk",doc)[0].nodeValue;
                if (tempStatus == ''){
                    tempStatus='not defined';
                };     
                if (colRiskLabel.search(tempStatus) < 0){
                    if (colRiskLabel == ''){
                        colRiskLabel=tempStatus;
                        tempStatus=tempStatus.split("/").join("__");
                        tempStatus=tempStatus.split(" ").join("_");
                        colRiskTemp = JSON.stringify(colRisk);
                        colRiskTemp='{"' + tempStatus + '":0}';
                    } else {
                        colRiskLabel=colRiskLabel + '|' + tempStatus;
                        tempStatus=tempStatus.split("/").join("__");
                        tempStatus=tempStatus.split(" ").join("_");
                        colRiskTemp = JSON.stringify(colRisk);
                        colRiskTemp=colRiskTemp.replace('}', ', "' + tempStatus + '":0}');
                    };
                    colRisk=JSON.parse(colRiskTemp);
                } else {
                    tempStatus=tempStatus.split("/").join("__");
                    tempStatus=tempStatus.split(" ").join("_");    
                };  
            colRisk[tempStatus]=colRisk[tempStatus] + 1;
            };

            var colAudits=[];
            var vAudits = xpath.select("/portfolio/audits/Audit/About/@id",doc);
            for (var i=0; i<vAudits.length; i++) {
                var NewEntry = {
                    PortfolioId: portfolioid,
                    AuditId: vAudits[i].nodeValue,
                    Title: '',
                    Background:'',
                };
                var res = xpath.select("/portfolio/audits/Audit/About[@id='" + vAudits[i].nodeValue + "']/title/tx[@l='" + sellang + "']/@nm",doc);
                if (res.length==1 && res[0] != null){
                    NewEntry.Title = res[0].nodeValue;
                } else {
                    res = xpath.select("/portfolio/audits/Audit/About[@id='" + vAudits[i].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@nm",doc);
                    if (res.length==1 && res[0] != null){
                        NewEntry.Title = res[0].nodeValue;
                    } else {
                        NewEntry.Title = '';
                    };
                };
                var res = xpath.select("/portfolio/audits/Audit/About[@id='" + vAudits[i].nodeValue + "']/../Background/ak",doc);
                if (res.length==1 && res[0].firstChild != null)
                    NewEntry.Background = res[0].firstChild.nodeValue;
                colAudits.push(NewEntry);
            };

            Nodes = [];
            KeyNodes = [];
            Edges = [];
            Support = [];
        
            //MapPortfolioReference(doc);
            //MapAuditObjects(doc, portfolioid);
            //MapRecommendationObjects(doc);
            var PortfolioMap = {
                support: Support,
                nodes: Nodes,
                edges: Edges
            };

            var doc1 = new Dom().parseFromString(Result[0].description);
            var Catalog = {
                _id: portfolioid,
                portfolioid: Result[0].portfolioid,
                name: xpath.select("/name/tx[@l='" + credentials.WorkLang + "']/@nm",doc1)[0].nodeValue,
                description: xpath.select("/name/tx[@l='" + credentials.WorkLang + "']/@description",doc1)[0].nodeValue,
                coverage: Result[0].coverage,
                org: Result[0].org,
                publish: Result[0].publish,
                status_data: colStatus,
                status_label: colStatusLabel,       //globalvalues.Recommendation.ImplementationStatus + "|not yet accessed",
                repeated_data: colRepeated,
                repeated_label: colRepeatedLabel,   //'New|Repeated|Partially',
                risk_data: colRisk,
                risk_label: colRiskLabel,           //globalvalues.Recommendation.RiskCharacterization,
                audits: colAudits,
                portfoliomap: PortfolioMap
            };
            resolve(Catalog);
        });
    });

};

//get portfolio aggregated overview
function LoadColPortfoliosOverview() {
    var dbparams = {};
    dbparams = { publish: '1' };

    var dbfields = { _id: 0, portfolioid: 1, description: 1, coverage: 1, org: 1, data: 1, publish: 1 };

    var sortfields = {"datepub": -1};

    return new Promise(function(resolve, reject){
        database.QueryData(dbparams, dbfields, sortfields).then(function(Result){
            //var colStatus =  JSON.parse('{"' + globalvalues.Recommendation.ImplementationStatus.split(" ").join("_").split("|").join('": 0, "') + '": 0, "not_yet_accessed": 0}');
            //var colRepeated = JSON.parse('{"No": 0, "Yes": 0, "Partially": 0}');
            //var colRisk =  JSON.parse('{"' + globalvalues.Recommendation.RiskCharacterization.split(" ").join("_").split("|").join('": 0, "') + '": 0}');
            var colStatus =  JSON.parse('{"not_yet_accessed":0}');
            var colRepeated = JSON.parse('{}');
            var colRisk =  JSON.parse('{}');
            var colStatusLabel =  'not yet accessed';
            var colRepeatedLabel = '';
            var colRiskLabel =  '';
            var colStatusTemp =  '';
            var colRepeatedTemp = '';
            var colRiskTemp =  '';

            for (var k=0; k<Result.length; k++) {
                var doc = new Dom().parseFromString(Result[k].data);
                var vRecommendations = xpath.select("/portfolio/audits/Audit/Recommendations/Recommendation/@nr",doc);

                for (var i=0; i<vRecommendations.length; i++) {
                    var vMonitoring = xpath.select("/portfolio/audits/Audit/Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/monitoring/assessment/@date",doc);
                    if (vMonitoring.length > 0) {
                        tempStatus=xpath.select("/portfolio/audits/Audit/Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/monitoring/assessment[@date='" + vMonitoring[(vMonitoring.length-1)].nodeValue + "']/@status",doc)[0].nodeValue;
                        if (tempStatus != ''){
                            if (colStatusLabel.search(tempStatus) < 0){
                                if (colStatusLabel == ''){
                                    colStatusLabel=tempStatus;
                                    tempStatus=tempStatus.split("/").join("__");
                                    tempStatus=tempStatus.split(" ").join("_");
                                    //colStatusTemp = JSON.stringify(colStatus);
                                    colStatusTemp=colStatusTemp.replace('}', ', {"' + tempStatus + '":0}');
                                } else {
                                    colStatusLabel=colStatusLabel + '|' + tempStatus;
                                    tempStatus=tempStatus.split("/").join("__");
                                    tempStatus=tempStatus.split(" ").join("_");
                                    colStatusTemp = JSON.stringify(colStatus);
                                    colStatusTemp=colStatusTemp.replace('}', ', "' + tempStatus + '":0}');
                                };
                                colStatus=JSON.parse(colStatusTemp);
                            } else {
                                tempStatus=tempStatus.split("/").join("__");
                                tempStatus=tempStatus.split(" ").join("_");    
                            };  
                        }else{
                            tempStatus='not_yet_accessed';
                        };        
                    } else {
                        tempStatus='not_yet_accessed';
                    };
                    colStatus[tempStatus]=colStatus[tempStatus] + 1;

                    tempStatus = xpath.select("/portfolio/audits/Audit/Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@repeated",doc)[0].nodeValue;
                    if (tempStatus == ''){
                        tempStatus='not defined';
                    };     
                    if (colRepeatedLabel.search(tempStatus) < 0){
                        if (colRepeatedLabel == ''){
                            colRepeatedLabel=tempStatus;
                            tempStatus=tempStatus.split("/").join("__");
                            tempStatus=tempStatus.split(" ").join("_");
                            colRepeatedTemp = JSON.stringify(colRepeated);
                            colRepeatedTemp='{"' + tempStatus + '":0}';
                        } else {
                            colRepeatedLabel=colRepeatedLabel + '|' + tempStatus;
                            tempStatus=tempStatus.split("/").join("__");
                            tempStatus=tempStatus.split(" ").join("_");
                            colRepeatedTemp = JSON.stringify(colRepeated);
                            colRepeatedTemp=colRepeatedTemp.replace('}', ', "' + tempStatus + '":0}');
                        };
                        colRepeated=JSON.parse(colRepeatedTemp);
                    } else {
                        tempStatus=tempStatus.split("/").join("__");
                        tempStatus=tempStatus.split(" ").join("_");    
                    };  
                    colRepeated[tempStatus]=colRepeated[tempStatus] + 1;

                    tempStatus = xpath.select("/portfolio/audits/Audit/Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@risk",doc)[0].nodeValue;
                    if (tempStatus == ''){
                        tempStatus='not defined';
                    };     
                    if (colRiskLabel.search(tempStatus) < 0){
                        if (colRiskLabel == ''){
                            colRiskLabel=tempStatus;
                            tempStatus=tempStatus.split("/").join("__");
                            tempStatus=tempStatus.split(" ").join("_");
                            colRiskTemp = JSON.stringify(colRisk);
                            colRiskTemp='{"' + tempStatus + '":0}';
                        } else {
                            colRiskLabel=colRiskLabel + '|' + tempStatus;
                            tempStatus=tempStatus.split("/").join("__");
                            tempStatus=tempStatus.split(" ").join("_");
                            colRiskTemp = JSON.stringify(colRisk);
                            colRiskTemp=colRiskTemp.replace('}', ', "' + tempStatus + '":0}');
                        };
                        colRisk=JSON.parse(colRiskTemp);
                    } else {
                        tempStatus=tempStatus.split("/").join("__");
                        tempStatus=tempStatus.split(" ").join("_");    
                    };  
                    colRisk[tempStatus]=colRisk[tempStatus] + 1;
                };

            };

            var colAudits=[];
            Nodes = [];
            KeyNodes = [];
            Edges = [];
            Support = [];
        
            var PortfolioMap = {
                support: Support,
                nodes: Nodes,
                edges: Edges
            };

            var Catalog = {
                _id: '',
                portfolioid: '',
                description: '',
                coverage: '',
                org: '',
                publish: '',
                status_data: colStatus,
                status_label: colStatusLabel,       //globalvalues.Recommendation.ImplementationStatus + "|not yet accessed",
                repeated_data: colRepeated,
                repeated_label: colRepeatedLabel,   //'New|Repeated|Partially',
                risk_data: colRisk,
                risk_label: colRiskLabel,           //globalvalues.Recommendation.RiskCharacterization,
                audits: colAudits,
                portfoliomap: PortfolioMap
            };
            resolve(Catalog);
        });
    });

};

function LoadFindingsOfRecommendation(id, auditid, recid){
    var dbparams =  { portfolioid: id };
    var dbfields = { _id: 0, data: 1 };

    var sortfields = {"auditid": -1};

    return new Promise(function(resolve, reject){
        database.QueryData(dbparams, dbfields, sortfields).then(function(Result){
            var doc = new Dom().parseFromString(Result[0].data);
            var Catalog = LoadRelatedFindings(doc, auditid, recid);
            resolve(Catalog);
        });
    });
};

function LoadRelatedFindings(doc, auditid, recid) {
    tempFindings='';
    vNumber=0;
    vFindingNumber = 0;
    vFindingDescription = '';
    vFindingName = '';

    var vColFindings = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + recid + "']/findings/finding/@nr",doc);
    if (vColFindings.length == 0){
        tempFindings = tempFindings + '<p>No related findings!</p>'
    } else {
        for (var jF=0; jF<vColFindings.length; jF++) {
            vFindingName = '';
            if (xpath.select("boolean(/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vColFindings[jF].nodeValue + "']/@number)",doc)){
                vFindingNumber = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vColFindings[jF].nodeValue + "']/@number",doc)[0].nodeValue
            } else {
                vFindingNumber = 0;
            };
            if (typeof xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vColFindings[jF].nodeValue + "']/quote[@type='description']/.",doc)[0] !== 'undefined'){
                if (xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vColFindings[jF].nodeValue + "']/quote[@type='description']/.",doc)[0].firstChild === null)
                {
                    vFindingDescription= '';
                }else{
                    vFindingDescription= xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vColFindings[jF].nodeValue + "']/quote[@type='description']/.",doc)[0].firstChild.nodeValue;
                };
            } else {
                vFindingDescription= '';
            }
            if (xpath.select("boolean(/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vColFindings[jF].nodeValue + "']/@nm)",doc)){
                vFindingName = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vColFindings[jF].nodeValue + "']/@nm",doc)[0].nodeValue
            };

            tempFindings = tempFindings + '<p><b>#'  + vFindingNumber + ' ' + vFindingName + '</b><br/>' + vFindingDescription +'</p>'
            // var NewEntry={
            //     Number: '#' + vFindingNumber,
            //     Name: vFindingName,
            //     Description: vFindingDescription
            // };
            // tempFindings.push(NewEntry);
        };
    };
    return tempFindings;
};

function GetRecommendationSearchAttribute(objectValue, searchLanguage) {
    var valueAttribute = '';
    var valueToReturn = '';
    var separator = objectValue.indexOf("=");
    var objectType = objectValue.substr(0, separator);
    var objectSearch = objectValue.substr(separator+2, (objectValue.length-separator-3));
    var weblang =[];
    var criteria =[];

    //console.log(objectType + " : " + objectSearch + " : " + searchLanguage);

    if (objectType == 'risk'){
        if (searchLanguage=="EN") {
            weblang=globalvalues.weblang.en.Recommendation.RiskCharacterization.split("|");
        }else if (searchLanguage=="SQ") {
            weblang=globalvalues.weblang.sq.Recommendation.RiskCharacterization.split("|");
        }else if (searchLanguage=="SR") {
            weblang=globalvalues.weblang.sr.Recommendation.RiskCharacterization.split("|");
        };
        criteria=globalvalues.Recommendation.RiskCharacterization.split("|");
        for (index = 0, SelLevelLen = (weblang.length); index < SelLevelLen; ++index) {
            if (objectSearch == weblang[index]){
                valueAttribute = criteria[index];
                break;
            };
        };
        valueToReturn = objectType + '="' + valueAttribute + '"';
    } else if (objectType == 'riskevaluation'){
        if (searchLanguage=="EN") {
            weblang=globalvalues.weblang.en.Recommendation.RiskEvaluation.split("|");
        }else if (searchLanguage=="SQ") {
            weblang=globalvalues.weblang.sq.Recommendation.RiskEvaluation.split("|");
        }else if (searchLanguage=="SR") {
            weblang=globalvalues.weblang.sr.Recommendation.RiskEvaluation.split("|");
        };
        criteria=globalvalues.Recommendation.RiskEvaluation.split("|");
        for (index = 0, SelLevelLen = (weblang.length); index < SelLevelLen; ++index) {
            if (objectSearch == weblang[index]){
                valueAttribute = criteria[index];
                break;
            };
        };
        valueToReturn = objectType + '="' + valueAttribute + '"';
    } else if (objectType == 'status'){
        if (searchLanguage=="EN") {
            weblang=globalvalues.weblang.en.Recommendation.ImplementationStatus.split("|");
        }else if (searchLanguage=="SQ") {
            weblang=globalvalues.weblang.sq.Recommendation.ImplementationStatus.split("|");
        }else if (searchLanguage=="SR") {
            weblang=globalvalues.weblang.sr.Recommendation.ImplementationStatus.split("|");
        };
        criteria=globalvalues.Recommendation.ImplementationStatus.split("|");
        for (index = 0, SelLevelLen = (weblang.length); index < SelLevelLen; ++index) {
            if (objectSearch == weblang[index]){
                valueAttribute = criteria[index];
                break;
            };
        };
        valueToReturn = objectType + '="' + valueAttribute + '"';
    } else if (objectType == 'repeated'){
        valueAttribute=objectSearch.substr((objectSearch.indexOf("(")+1), (objectSearch.indexOf(")")-objectSearch.indexOf("(")-1))
        valueToReturn = objectType + '="' + valueAttribute + '"';
    } else if (objectType == 'priority'){
        if (searchLanguage=="EN") {
            weblang=globalvalues.weblang.en.Recommendation.Priority.split("|");
        }else if (searchLanguage=="SQ") {
            weblang=globalvalues.weblang.sq.Recommendation.Priority.split("|");
        }else if (searchLanguage=="SR") {
            weblang=globalvalues.weblang.sr.Recommendation.Priority.split("|");
        };
        criteria=globalvalues.Recommendation.Priority.split("|");
        for (index = 0, SelLevelLen = (weblang.length); index < SelLevelLen; ++index) {
            if (objectSearch == weblang[index]){
                valueAttribute = criteria[index];
                break;
            };
        };
        valueToReturn = objectType + '="' + valueAttribute + '"';
    } else {
        valueToReturn = '';
    };
    return valueToReturn;
};

module.exports.CreatePortfolio = CreatePortfolio;
module.exports.UpdatePortfolio = UpdatePortfolio;
module.exports.DeletePortfolio = DeletePortfolio;
module.exports.DeleteAuditFromPortfolio = DeleteAuditFromPortfolio;
module.exports.AddAuditToPortfolio = AddAuditToPortfolio;
module.exports.ListPortfolios = ListPortfolios;
module.exports.LoadPortfolioOverview = LoadPortfolioOverview;
module.exports.LoadPortfolioAudit = LoadPortfolioAudit;
module.exports.LoadSearchAudit = LoadSearchAudit;
module.exports.ListPortfoliosFromUser = ListPortfoliosFromUser;
module.exports.LoadNewPortfolioOverview = LoadNewPortfolioOverview;
module.exports.ListPortfolioBasic = ListPortfolioBasic;
module.exports.Search = Search;
module.exports.SearchPortfolioOverview = SearchPortfolioOverview;
module.exports.LoadColPortfoliosOverview = LoadColPortfoliosOverview;
module.exports.LoadFindingsOfRecommendation = LoadFindingsOfRecommendation;
module.exports.GetRecommendationSearchAttribute = GetRecommendationSearchAttribute;
