//credentials used in the app
var credentials = require('../credentials.js');

var fs = require('fs'),
    path = require('path');

//logging system
var log = require('./log.js');

var xpath   = require('xpath');
var Dom     = require('xmldom').DOMParser;

function CrawlPreAssessment(Auditfileid, CrawlerFileId) {
    var data = fs.readFileSync(Auditfileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var Sentence = '';
    var doc = new Dom().parseFromString(data);
    
    var vElements = xpath.select("//paElement/val/tx[@l='" + credentials.WorkLang + "']/@name",doc);
    for (var m=0; m<vElements.length; m++) {
        if (!(vElements[m].nodeValue == '' || vElements[m].nodeValue == 'Yes' || vElements[m].nodeValue == 'No' || vElements[m].nodeValue == 'Low' || vElements[m].nodeValue == 'Medium' || vElements[m].nodeValue == 'High')){
            fs.appendFileSync(CrawlerFileId, vElements[m].nodeValue +'\n');
        }
    }
};

function CrawlPlan(Auditfileid, CrawlerFileId) {
    var data = fs.readFileSync(Auditfileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var Sentence = '';
    var newSentence = '';
    var doc = new Dom().parseFromString(data);

    var vItems = xpath.select("//Matrix/Objectives/obj/tx[@l='" + credentials.WorkLang + "']/@name",doc);
    for (var i=0; i<vItems.length; i++) {
        if (!(vItems[i].nodeValue == '' || vItems[i].nodeValue == 'Yes' || vItems[i].nodeValue == 'No' || vItems[i].nodeValue == 'Low' || vItems[i].nodeValue == 'Medium' || vItems[i].nodeValue == 'High'|| vItems[i].nodeValue == 'To be developed' || vItems[i].nodeValue == 'To be filled in by auditor')){
            newSentence = vItems[i].nodeValue  +'.\n';
            newSentence = newSentence.replace('..\n','.\n');
            if (Sentence != newSentence){
                Sentence = newSentence;
                fs.appendFileSync(CrawlerFileId, newSentence);
            }
        }
    }
    Sentence = '';
    var vItems = xpath.select("//Matrix/Criteria/cri/tx[@l='" + credentials.WorkLang + "']/@name",doc);
    for (var i=0; i<vItems.length; i++) {
        if (!(vItems[i].nodeValue == '' || vItems[i].nodeValue == 'Yes' || vItems[i].nodeValue == 'No' || vItems[i].nodeValue == 'Low' || vItems[i].nodeValue == 'Medium' || vItems[i].nodeValue == 'High'|| vItems[i].nodeValue == 'To be developed' || vItems[i].nodeValue == 'To be filled in by auditor')){
            newSentence = vItems[i].nodeValue  +'.\n';
            newSentence = newSentence.replace('..\n','.\n');
            if (Sentence != newSentence){
                Sentence = newSentence;
                fs.appendFileSync(CrawlerFileId, newSentence);
            }
        }
    }
    Sentence = '';
    var vItems = xpath.select("//Matrix/InformationRequired/inf/tx[@l='" + credentials.WorkLang + "']/@name",doc);
    for (var i=0; i<vItems.length; i++) {
        if (!(vItems[i].nodeValue == '' || vItems[i].nodeValue == 'Yes' || vItems[i].nodeValue == 'No' || vItems[i].nodeValue == 'Low' || vItems[i].nodeValue == 'Medium' || vItems[i].nodeValue == 'High'|| vItems[i].nodeValue == 'To be developed' || vItems[i].nodeValue == 'To be filled in by auditor')){
            newSentence = vItems[i].nodeValue  +'.\n';
            newSentence = newSentence.replace('..\n','.\n');
            if (Sentence != newSentence){
                Sentence = newSentence;
                fs.appendFileSync(CrawlerFileId, newSentence);
            }
        }
    }
    Sentence = '';
    var vItems = xpath.select("//Matrix/AnalysisMethod/anm/tx[@l='" + credentials.WorkLang + "']/@name",doc);
    for (var i=0; i<vItems.length; i++) {
        if (!(vItems[i].nodeValue == '' || vItems[i].nodeValue == 'Yes' || vItems[i].nodeValue == 'No' || vItems[i].nodeValue == 'Low' || vItems[i].nodeValue == 'Medium' || vItems[i].nodeValue == 'High'|| vItems[i].nodeValue == 'To be developed' || vItems[i].nodeValue == 'To be filled in by auditor')){
            newSentence = vItems[i].nodeValue  +'.\n';
            newSentence = newSentence.replace('..\n','.\n');
            if (Sentence != newSentence){
                Sentence = newSentence;
                fs.appendFileSync(CrawlerFileId, newSentence);
            }
        }
    }
    Sentence = '';
    var vItems = xpath.select("//Matrix/foundPreviously/fp/tx[@l='" + credentials.WorkLang + "']/@name",doc);
    for (var i=0; i<vItems.length; i++) {
        if (!(vItems[i].nodeValue == '' || vItems[i].nodeValue == 'Yes' || vItems[i].nodeValue == 'No' || vItems[i].nodeValue == 'Low' || vItems[i].nodeValue == 'Medium' || vItems[i].nodeValue == 'High'|| vItems[i].nodeValue == 'To be developed' || vItems[i].nodeValue == 'To be filled in by auditor')){
            newSentence = vItems[i].nodeValue  +'.\n';
            newSentence = newSentence.replace('..\n','.\n');
            if (Sentence != newSentence){
                Sentence = newSentence;
                fs.appendFileSync(CrawlerFileId, newSentence);
            }
        }
    }
    Sentence = '';
    var vItems = xpath.select("//Matrix/Conclusion/clu/tx[@l='" + credentials.WorkLang + "']/@name",doc);
    for (var i=0; i<vItems.length; i++) {
        if (!(vItems[i].nodeValue == '' || vItems[i].nodeValue == 'Yes' || vItems[i].nodeValue == 'No' || vItems[i].nodeValue == 'Low' || vItems[i].nodeValue == 'Medium' || vItems[i].nodeValue == 'High'|| vItems[i].nodeValue == 'To be developed' || vItems[i].nodeValue == 'To be filled in by auditor')){
            newSentence = vItems[i].nodeValue  +'.\n';
            newSentence = newSentence.replace('..\n','.\n');
            if (Sentence != newSentence){
                Sentence = newSentence;
                fs.appendFileSync(CrawlerFileId, newSentence);
            }
        }
    }
};

function CrawlFindings(Auditfileid, CrawlerFileId) {
    var data = fs.readFileSync(Auditfileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var Sentence = '';
    var doc = new Dom().parseFromString(data);

    var vElements = xpath.select("//Cases/Case/quote",doc);
    for (var m=0; m<vElements.length; m++) {
        Sentence= vElements[m].firstChild.nodeValue;
        if (!(Sentence == '' || Sentence == 'Yes' || Sentence == 'No' || Sentence == 'Low' || Sentence == 'Medium' || Sentence == 'High')){
            fs.appendFileSync(CrawlerFileId, Sentence +'\n');
        }
    }
    
};

function LoadCrawler(Auditfileid, CrawlerFileId) {
    var data = fs.readFileSync(Auditfileid, { encoding : 'UTF-8' });
    // Create an XMLDom Element:
    var Sentence = '';
    var doc = new Dom().parseFromString(data);
    
    //Crawl reference and creates crawler file as nlp source file
    var res = xpath.select("/Audit/About/title/tx[@l='" + credentials.WorkLang + "']/@name",doc);
    if (res.length==1 && res[0] != null)
        Sentence = res[0].nodeValue + '\n';

    var res = xpath.select("/Audit/Background/ak",doc);
    if (res.length==1 && res[0].firstChild != null)
        Sentence =  Sentence + res[0].firstChild.nodeValue + '\n';

    var res = xpath.select("/Audit/Scope/ak",doc);
    if (res.length==1 && res[0].firstChild != null)
        Sentence =  Sentence + res[0].firstChild.nodeValue + '\n';

    fs.writeFileSync(CrawlerFileId, Sentence);            

    CrawlPreAssessment(Auditfileid, CrawlerFileId);
    CrawlPlan(Auditfileid, CrawlerFileId);
    CrawlFindings(Auditfileid, CrawlerFileId);

    return CrawlerFileId;
};

module.exports.LoadCrawler = LoadCrawler;