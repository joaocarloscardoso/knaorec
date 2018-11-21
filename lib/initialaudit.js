var fs = require('fs'),
    path = require('path');

//logging system
var log = require('./log.js');
//credentials used in the app
var credentials = require('../credentials.js');

var xpath   = require('xpath');
var Dom     = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;

module.exports = function(dir){
    var WorkPath = dir;
    return {
        // Return only base file name without dir
        CreateInitialAuditXML: function() {
            var FilePreAssessPath = credentials.CoreSetPath + 'ITAuditHandbookPreActivities.xml' ;
            var dataPreAssess = fs.readFileSync(FilePreAssessPath, { encoding : 'UTF-8' });
            var FileCoreDomainsPath = credentials.CoreSetPath + 'ITAuditHandbook.xml' ;
            var dataCoreDomains = fs.readFileSync(FileCoreDomainsPath, { encoding : 'UTF-8' });

            var vInitialXML = '<Audit><About id="" descriptionfile=""><version id="1.0" name=""/><title><tx l="en" name="" rem=""/></title><WorkingLanguage wl="en"/></About><Background><ak/></Background><Scope><ak/></Scope>';
            vInitialXML = vInitialXML + dataPreAssess;
            vInitialXML = vInitialXML + '<Arrangements><team/><timetable/></Arrangements>';
            vInitialXML = vInitialXML + dataCoreDomains;
            vInitialXML = vInitialXML + '<PlugIns/><Cases/></Audit>';

            // write to a new file named
            fs.writeFile(WorkPath, vInitialXML, (err) => {  
                // throws an error, you could also catch it here
                if (err) throw err;

                // success case, the file was saved
                log.info('New audit file created:' + WorkPath);
            });            
        },
        VerifyAuditFile: function(fileid) {
            return fs.existsSync(fileid);
        },
        GetAuditReference: function(fileid) {
            var AuditReference = {
                AuditId: '',
                Title: '',
                Background:'',
                Scope:''
            };
            var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
            // Create an XMLDom Element:
            var doc = new Dom().parseFromString(data);
            
            var res = xpath.select("/Audit/About/@id",doc);
            if (res.length==1)
                AuditReference.AuditId = res[0].nodeValue;            
 
            var res = xpath.select("/Audit/About/title/tx[@l='eng']/@name",doc);
            if (res.length==1)
                AuditReference.Title = res[0].nodeValue;

            var res = xpath.select("/Audit/Background/ak",doc);
            if (res.length==1)
                AuditReference.Background = res[0].firstChild.nodeValue;

            var res = xpath.select("/Audit/Scope/ak",doc);
            if (res.length==1)
                AuditReference.Scope = res[0].firstChild.nodeValue;

            return AuditReference;
        },
        SetAuditReference: function(fileid, AuditReference) {
            var data = fs.readFileSync(fileid, { encoding : 'UTF-8' });
            var serializer = new XMLSerializer();
            // Create an XMLDom Element:
            var doc = new Dom().parseFromString(data);
            
            var res = xpath.select("/Audit/About/@id",doc);
            res[0].data = AuditReference.AuditId;            
 
            var res = xpath.select("/Audit/About/title/tx[@l='eng']/@name",doc);
            res[0].data = AuditReference.Title;

            var res = xpath.select("/Audit/Background/ak",doc);
             //other possibility: .childNodes[0] instead of .firstChild
             res[0].firstChild.data = AuditReference.Background;

            var res = xpath.select("/Audit/Scope/ak",doc);
            res[0].firstChild.data = AuditReference.Scope;

            var writetofile = serializer.serializeToString(doc);

            fs.writeFile(fileid, writetofile, (err) => {  
                // throws an error, you could also catch it here
                if (err) throw err;
            });            
        }
    };
};

