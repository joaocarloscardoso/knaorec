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

function CreatePortfolio(dir){
    var WorkPath = dir;
    var vInitialXML = '<portfolio id="" description="" coverage="" org="" publish=""><audits></audits></portfolio>';

    // write to a new file named
    fs.writeFile(WorkPath, vInitialXML, (err) => {  
        // throws an error, you could also catch it here
        if (err) throw err;

        // success case, the file was saved
        log.info('New portfolio created:' + WorkPath);
    });            
};

function VerifyPortfolio(fileid) {
    return fs.existsSync(fileid);
};

function GetPortfolioReference(fileid) {
    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);
    
    var Porfolio = {
        portfolioid: xpath.select("/portfolio/@id",doc)[0].nodeValue,
        description: xpath.select("/portfolio/@description",doc)[0].nodeValue,
        coverage: xpath.select("/portfolio/@coverage",doc)[0].nodeValue,
        org: xpath.select("/portfolio/@org",doc)[0].nodeValue,
        publish: xpath.select("/portfolio/@publish",doc)[0].nodeValue
    };

    return Porfolio;
};

function SetPortfolioReference(fileid, PortfolioReference) {
    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    //var serializer = new XMLSerializer();
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);
    
    var res = xpath.select("/portfolio",doc);
    res[0].setAttribute('id',PortfolioReference.id);
    res[0].setAttribute('description',PortfolioReference.description);
    res[0].setAttribute('coverage',PortfolioReference.coverage);
    res[0].setAttribute('org',PortfolioReference.org);
    res[0].setAttribute('publish',PortfolioReference.publish);

    var writetofile = new XMLSerializer().serializeToString(doc);
    //fs.writeFile(fileid, writetofile, (err) => {  
        // throws an error, you could also catch it here
    //    if (err) throw err;
    //});            
    fs.writeFileSync(fileid, writetofile);
};

function LoadPortfolioAudits(fileid) {
    var Catalog = [];
    tempTitle = '';
    tempBackground = '';
    tempScope = '';
    vOrderNumber=0;

    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    var vAudits = xpath.select("/portfolio/audits/Audit/About/@id",doc);

    for (var i=0; i<vAudits.length; i++) {
        if (xpath.select("boolean(/portfolio/audits/Audit/About[@id='" + vAudits[i].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name)",doc)){
            tempTitle = xpath.select("/portfolio/audits/Audit/About[@id='" + vAudits[i].nodeValue + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc)[0].nodeValue
        } else {
            tempTitle = '';
        };
        if (xpath.select("boolean(/portfolio/audits/Audit/About[@id='" + vAudits[i].nodeValue + "']/../@order)",doc)){
            vOrderNumber = xpath.select("/portfolio/audits/Audit/About[@id='" + vAudits[i].nodeValue + "']/../@order",doc)[0].nodeValue
        } else {
            vOrderNumber = 0;
        };
        if (xpath.select("/portfolio/audits/Audit/About[@id='" + vAudits[i].nodeValue + "']/../Background",doc)[0].firstChild === null)
        {
            tempBackground= '';
        }else{
            tempBackground= xpath.select("/portfolio/audits/Audit/About[@id='" + vAudits[i].nodeValue + "']/../Background",doc)[0].firstChild.nodeValue;
        };
        if (xpath.select("/portfolio/audits/Audit/About[@id='" + vAudits[i].nodeValue + "']/../Scope",doc)[0].firstChild === null)
        {
            tempScope= '';
        }else{
            tempScope= xpath.select("/portfolio/audits/Audit/About[@id='" + vAudits[i].nodeValue + "']/../Scope",doc)[0].firstChild.nodeValue;
        };
        var vRecs = xpath.select("/portfolio/audits/Audit/About[@id='" + vAudits[i].nodeValue + "']/../Recommendations/Recommendation/@nr",doc);

        var NewEntry = {
            auditid: vAudits[i].nodeValue,
            order: vOrderNumber,
            title: tempTitle,
            background: tempBackground,
            scope: tempScope,
            recnumber: vRecs.length
            //,Cases:LoadPortfolioFindings(fileid, vAudits[i].nodeValue),
            //Recommendations: LoadPortfolioRecommendations(fileid, vAudits[i].nodeValue)
        };
        Catalog.push(NewEntry);        
    }
    console.log(Catalog);
    return Catalog;
};

function LoadAuditRecommendations(fileid, auditid) {
    Catalog = [];
    tempDescription = '';
    tempTimeline ='';
    tempStatus='';
    tempFindings='';
    vNumber=0;
    vFindingNumber = 0;

    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

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
            tempStatus='(not yet accessed))';
        };

        tempFindings='';
        var vColFindings = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/findings/finding/@nr",doc);
        for (var jF=0; jF<vColFindings.length; jF++) {
            if (xpath.select("boolean(/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vColFindings[jF].nodeValue + "']/@number)",doc)){
                vFindingNumber = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vColFindings[jF].nodeValue + "']/@number",doc)[0].nodeValue
            } else {
                vFindingNumber = 0;
            };        
            if (jF === 0) {
                tempFindings = vColFindings[jF].nodeValue + "#" + vFindingNumber;
            } else {
                tempFindings = tempFindings + '|' + vColFindings[jF].nodeValue + "#" + vFindingNumber;
            }
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

function LoadRecPriorities(fileid, auditid) {
    var ColPriorities =  globalvalues.Recommendation.Priority.split("|");
    var CatPriorities = [];
    for (index = 0, SelPrioritiesLen = (ColPriorities.length); index < SelPrioritiesLen; ++index) {
        var NewEntry = {
            Priority: ColPriorities[index],
            Number: 0
        };
        CatPriorities.push(NewEntry);
    };

    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    var vRecommendations = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation/@nr",doc);
    for (var i=0; i<vRecommendations.length; i++) {
        if (
            CatPriorities.some(Node => 
                Node.Priority === xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@priority",doc)[0].nodeValue
            )) {
                CatPriorities.find(Node => 
                    Node.Priority === xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@priority",doc)[0].nodeValue
                ).Number = CatPriorities.find( Node => 
                    Node.Priority === xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@priority",doc)[0].nodeValue
                ).Number + 1;
            }
    };
    return CatPriorities;
};

function LoadRecCharacterization(fileid, auditid) {
    var ColCharacterization =  globalvalues.Recommendation.RiskCharacterization.split("|");
    var CatCharacterization = [];
    for (index = 0, SelCharacterizationLen = (ColCharacterization.length); index < SelCharacterizationLen; ++index) {
        var NewEntry = {
            Risk: ColCharacterization[index],
            Number: 0
        };
        CatCharacterization.push(NewEntry);
    };

    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    var vRecommendations = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation/@nr",doc);
    for (var i=0; i<vRecommendations.length; i++) {
        if (
            CatCharacterization.some(Node => 
                Node.Risk === xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@risk",doc)[0].nodeValue
            )) {
                CatCharacterization.find(Node => 
                    Node.Risk === xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@risk",doc)[0].nodeValue
                ).Number = CatCharacterization.find( Node => 
                    Node.Risk === xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@risk",doc)[0].nodeValue
                ).Number + 1;
            }
    };
    return CatCharacterization;
};

function LoadRecImportance(fileid, auditid) {
    var ColImportance =  globalvalues.Recommendation.Importance.split("|");
    var CatImportance = [];
    for (index = 0, SelImportanceLen = (ColImportance.length); index < SelImportanceLen; ++index) {
        var NewEntry = {
            Importance: ColImportance[index],
            Number: 0
        };
        CatImportance.push(NewEntry);
    };

    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

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

function LoadRecLevel(fileid, auditid) {
    var ColLevel =  globalvalues.Recommendation.RiskEvaluation.split("|");
    var CatLevel = [];
    for (index = 0, SelLevelLen = (ColLevel.length); index < SelLevelLen; ++index) {
        var NewEntry = {
            Level: ColLevel[index],
            Number: 0
        };
        CatLevel.push(NewEntry);
    };

    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    var vRecommendations = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation/@nr",doc);
    for (var i=0; i<vRecommendations.length; i++) {
        if (
            CatLevel.some(Node => 
                Node.Level === xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@riskevaluation",doc)[0].nodeValue
            )) {
                CatLevel.find(Node => 
                    Node.Level === xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@riskevaluation",doc)[0].nodeValue
                ).Number = CatLevel.find( Node => 
                    Node.Level === xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Recommendations/Recommendation[@nr='" + vRecommendations[i].nodeValue + "']/@riskevaluation",doc)[0].nodeValue
                ).Number + 1;
            }
    };
    return CatLevel;
};

function LoadPortfolioRecommendations(fileid, auditid) {
    var tempTitle='';
    var tempRef='';
    var tempNumber=0;
    var tempNew=0;
    var tempPart=0;
    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    //audit reference section
    tempRef = auditid;
    var res = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/title/tx[@l='" + credentials.WorkLang + "']/@name",doc);
    if (res.length==1 && res[0] != null){
        tempTitle = res[0].nodeValue;
    } else {
        tempTitle = '';
    };

    var List  = {
        AuditReference: tempRef,
        AuditTitle: tempTitle,
        StatPriorities: LoadRecPriorities(fileid, auditid),
        StatCharacterization: LoadRecCharacterization(fileid, auditid),
        StatImportance: LoadRecImportance(fileid, auditid),
        StatLevel: LoadRecLevel(fileid, auditid),
        Recommendations: LoadAuditRecommendations(fileid, auditid),
        NumberOfRecommendations: 0,
        NumberOfNewRecommendations: 0,
        NumberOfRepRecommendations: 0,
        NumberOfPartRecommendations: 0,
        StatStatus: []
    };
    List.NumberOfRecommendations = List.Recommendations.length;
    for (var j = 0; j < List.Recommendations.length; j++){
        if (List.Recommendations[j].Repeated === 'No'){
            tempNew=tempNew+1;
        }
        if (List.Recommendations[j].Repeated === 'Partially'){
            tempPart=tempPart+1;
        }
    };
    List.NumberOfNewRecommendations = tempNew;
    List.NumberOfPartRecommendations = tempPart;
    List.NumberOfRepRecommendations = (parseInt(List.NumberOfRecommendations) - parseInt(List.NumberOfNewRecommendations) - parseInt(List.NumberOfPartRecommendations))
    var ColStatus =  globalvalues.Recommendation.ImplementationStatus.split("|");
    for (index = 0; index < ColStatus.length; ++index) {
        tempNumber=0;
        for (var j = 0; j < List.Recommendations.length; j++){
            // look for the entry with a matching `code` value
            if (List.Recommendations[j].Status == ColStatus[index]){
                tempNumber=tempNumber+1;
            }
        }
        var NewEntry = {
            Status: ColStatus[index],
            Number: tempNumber
        };
        List.StatStatus.push(NewEntry);
    }
    return List;
};

function DeleteAuditFromPortfolio(fileid, auditid) {
    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    vItem2Delete = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']",doc);
    vItems[0].removeChild(vItem2Delete[0]);

    var writetofile = new XMLSerializer().serializeToString(doc);
    fs.writeFileSync(fileid, writetofile);
    return true;
};

function AddAuditToPortfolio(fileid, newfileid) {
    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    var NewAuditdata = fs.readFileSync(newfileid, { encoding : 'UTF-8' });
    var NewAuditdoc = new Dom().parseFromString(NewAuditdata);
    //select portfolio audits and selected audit to join root node
    var PortfolioRoot = xpath.select("/portfolio/audits/.",doc);
    var NewAuditNode = xpath.select("/Audit",NewAuditdoc);

    //get id of new audit in portfolio
    var res = xpath.select("/Audit/About/@id",NewAuditdoc);
    if (res.length==1 && res[0] != null)
        var AuditId = res[0].nodeValue;            

    //insert audit root node in XML portfolio file
    PortfolioRoot[0].appendChild(NewAuditNode[0]);

    //when adding an audit is necessary to add order xml attribute in Audit xml element
    var resPortfolio = xpath.select("/portfolio/audits/Audit/About[@id='" + AuditId + "']",doc);
    resPortfolio[0].setAttribute('order','0');

    var writetofile = new XMLSerializer().serializeToString(doc);
    fs.writeFileSync(fileid, writetofile);
    return true;
};

function LoadPortfolioFindings(fileid, auditid) {
    Catalog = [];
    tempDescription = '';
    vNumber=0;
    tempName = '';

    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);

    iCounter = 0;
    var vFindings = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case/@nr",doc);

    for (var i=0; i<vFindings.length; i++) {
        if (xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vFindings[i].nodeValue + "']/quote[@type='description']/.",doc)[0].firstChild === null)
        {
            tempDescription= '';
        }else{
            tempDescription= xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vFindings[i].nodeValue + "']/quote[@type='description']/.",doc)[0].firstChild.nodeValue;
        };
        if (xpath.select("boolean(/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vFindings[i].nodeValue + "']/@number)",doc)){
            vNumber = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vFindings[i].nodeValue + "']/@number",doc)[0].nodeValue
        } else {
            vNumber = 0;
        };
        if (xpath.select("boolean(/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vFindings[i].nodeValue + "']/@name)",doc)){
            tempName = xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vFindings[i].nodeValue + "']/@name",doc)[0].nodeValue
        } else {
            tempName = '';
        };

        var NewEntry = {
            RowId: '#' + String((iCounter+1)),
            Id: vFindings[i].nodeValue,
            Source: xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vFindings[i].nodeValue + "']/cts/@source",doc)[0].nodeValue,
            Domain: xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vFindings[i].nodeValue + "']/cts/@domain",doc)[0].nodeValue,
            Area: xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vFindings[i].nodeValue + "']/cts/@area",doc)[0].nodeValue,
            Issue: xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vFindings[i].nodeValue + "']/cts/@issue",doc)[0].nodeValue,
            Cause: xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vFindings[i].nodeValue + "']/@nm",doc)[0].nodeValue,
            Result: xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vFindings[i].nodeValue + "']/@eff",doc)[0].nodeValue,
            Number: vNumber,
            Name: tempName,
            Description: tempDescription,
            LegalAct: xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vFindings[i].nodeValue + "']/@act",doc)[0].nodeValue,
            ReportReference: xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vFindings[i].nodeValue + "']/@doc",doc)[0].nodeValue,
            Selected: xpath.select("/portfolio/audits/Audit/About[@id='" + auditid + "']/../Cases/Case[@nr='" + vFindings[i].nodeValue + "']/@Include",doc)[0].nodeValue
        };
        Catalog.push(NewEntry);        
        iCounter++;   
    }
    return Catalog;
};

//generate portfolio tree map: internal method
//generate json portfolio and save in database: orchestrates all other (get and load) xml methods 
function LoadPortfolioData(fileid) {
    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);
    
    var Porfolio = {
        portfolioid: xpath.select("/portfolio/@id",doc)[0].nodeValue,
        description: xpath.select("/portfolio/@description",doc)[0].nodeValue,
        coverage: xpath.select("/portfolio/@coverage",doc)[0].nodeValue,
        org: xpath.select("/portfolio/@org",doc)[0].nodeValue,
        publish: xpath.select("/portfolio/@publish",doc)[0].nodeValue,
        audits: LoadPortfolioAudits(fileid),
        treemap:''
    };

    return Porfolio;
};

function SaveToDatabase(fileid, userid) {
    var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var doc = new Dom().parseFromString(data);
    
    var Portfolio = {
        userid: userid,
        portfolioid: xpath.select("/portfolio/@id",doc)[0].nodeValue,
        description: xpath.select("/portfolio/@description",doc)[0].nodeValue,
        coverage: xpath.select("/portfolio/@coverage",doc)[0].nodeValue,
        org: xpath.select("/portfolio/@org",doc)[0].nodeValue,
        publish: xpath.select("/portfolio/@publish",doc)[0].nodeValue,
        data: data
    };

    var dbparams = {userid: userid,
        portfolioid: xpath.select("/portfolio/@id",doc)[0].nodeValue
    }

    database.SaveData(dbparams, Portfolio);
    return true;
};

function DeleteFromDatabase(portfolioid, userid) {
    var dbparams = {userid: userid,
        portfolioid: portfolioid
    }

    database.DeleteData(dbparams);
    return true;
};
//get list of portfolios: from database
//get portfolio data: from database


module.exports.CreatePortfolio = CreatePortfolio;
module.exports.VerifyPortfolio = VerifyPortfolio;
module.exports.GetPortfolioReference = GetPortfolioReference;
module.exports.SetPortfolioReference = SetPortfolioReference;
module.exports.DeleteAuditFromPortfolio = DeleteAuditFromPortfolio;
module.exports.AddAuditToPortfolio = AddAuditToPortfolio;
module.exports.LoadPortfolioData = LoadPortfolioData;
module.exports.LoadPortfolioFindings = LoadPortfolioFindings;
module.exports.LoadPortfolioRecommendations = LoadPortfolioRecommendations;
module.exports.SaveToDatabase = SaveToDatabase;
module.exports.DeleteFromDatabase = DeleteFromDatabase;

