//credentials used in the app
var credentials = require('../credentials.js');

//logging system
var log = require('./log.js');

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var urlDB = credentials.mongoDB.urlDB;

function SaveData(myquery, data){
    MongoClient.connect(urlDB, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db(credentials.mongoDB.dbportfolio);
        //var myquery = { requestid: RequestID };
        dbo.collection(credentials.mongoDB.colportfolio).deleteMany(myquery, function(err, obj) {
            if (err) throw err;
            dbo.collection(credentials.mongoDB.colportfolio).insertOne(data, function(err, res) {
                if (err) throw err;
                console.log("Document inserted");
                db.close();
            });
        });
    });
};

function InsertData(data){
    return new Promise(function(resolve, reject){
        MongoClient.connect(urlDB, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db(credentials.mongoDB.dbportfolio);
            //var myquery = { answer: "no" };
            dbo.collection(credentials.mongoDB.colportfolio).insertOne(data, function(err, res) {
                if (err) throw err;
                console.log("Document inserted");
                resolve(res.insertedId);
                db.close();
            });
        });
    });
};

function UpdateData(userid, id, data){
    var myquery = {userid: userid,
        _id: ObjectID(id)
    };

    return new Promise(function(resolve, reject){
        MongoClient.connect(urlDB, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;                
            var dbo = db.db(credentials.mongoDB.dbportfolio);       
            dbo.collection(credentials.mongoDB.colportfolio).updateOne(myquery, data, function(err, res) {
                if (err) throw err;
                console.log(res.result.nModified + " Document updated");
                resolve(res.result.nModified);
                db.close();
            });
        });
    });
};

function DeleteData(myquery){
    MongoClient.connect(urlDB, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db(credentials.mongoDB.dbportfolio);
        //var myquery = { requestid: RequestID };
        dbo.collection(credentials.mongoDB.colportfolio).deleteMany(myquery, function(err, obj) {
            if (err) throw err;
            console.log("Document deleted");
            db.close();
        });
    });
};

function QueryData(myquery, myfields, sortfields){
    return new Promise(function(resolve, reject){
        MongoClient.connect(urlDB, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db(credentials.mongoDB.dbportfolio);
            //var myquery = { answer: "no" };
            dbo.collection(credentials.mongoDB.colportfolio).find(myquery, { projection: myfields }).sort(sortfields).toArray(function(err, result) {
                if (err) throw err;
                resolve(result);
                db.close();
            });
        });
    });
};

function QueryDataAudits(myquery, myfields, sortfields){
    return new Promise(function(resolve, reject){
        MongoClient.connect(urlDB, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db(credentials.mongoDB.dbportfolio);
            //var myquery = { answer: "no" };
            dbo.collection(credentials.mongoDB.colsearch).find(myquery, { projection: myfields }).sort(sortfields).limit(100).toArray(function(err, result) {
                if (err) throw err;
                resolve(result);
                db.close();
            });
        });
    });
};

function QueryDataByID(myqueryId, myfields, sortfields){
    var ObjectId = require('mongodb').ObjectId; 
    return new Promise(function(resolve, reject){
        MongoClient.connect(urlDB, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db(credentials.mongoDB.dbportfolio);
            //var myquery = { answer: "no" };
            dbo.collection(credentials.mongoDB.colportfolio).find({ _id: ObjectId(myqueryId) }, { projection: myfields }).sort(sortfields).toArray(function(err, result) {
                if (err) throw err;
                resolve(result);
                db.close();
            });
        });
    });
};

function SearchDataByID(myqueryId, myfields, sortfields){
    var ObjectId = require('mongodb').ObjectId; 
    return new Promise(function(resolve, reject){
        MongoClient.connect(urlDB, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db(credentials.mongoDB.dbportfolio);
            //var myquery = { answer: "no" };
            dbo.collection(credentials.mongoDB.colaudits).find({ _id: ObjectId(myqueryId) }, { projection: myfields }).sort(sortfields).toArray(function(err, result) {
                if (err) throw err;
                resolve(result);
                db.close();
            });
        });
    });
};

//last published
//db.col.find().sort({"datepub": -1}).limit(1)

/*
function CreateRequestCUBE(SessionID, RequestID, ObjectID, Subject, userID) {

    MongoClient.connect(urlDB, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;

        var date = new Date();

        var dbo = db.db("notifications");
        var myobj = {   sessionid: SessionID, 
                        requestid: RequestID,
                        userid: userID,
                        requestdate: date,
                        objectid: ObjectID,
                        subject: Subject,
                        url: '',
                        explanation: '',
                        answer: "no"
                    };

        dbo.collection("notifications").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("Document inserted");
            db.close();
        });
    });

};

function UpdateDataCUBE(RequestID, url, explanation){
    console.log(RequestID);
    MongoClient.connect(urlDB, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        
        var dbo = db.db("notifications");
        
        var myquery = { requestid: RequestID };
        
        var newvalues = { $set: {url: url, explanation: explanation, answer: "yes" } };
        dbo.collection("notifications").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            db.close();
        });
    });
};

function DeleteByRequestID(RequestID){
    MongoClient.connect(urlDB, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("notifications");
        var myquery = { requestid: RequestID };
        dbo.collection("notifications").deleteMany(myquery, function(err, obj) {
            if (err) throw err;
            console.log(obj.result.n + " document(s) deleted");
            db.close();
        });
    });
};

function DeleteBySessionID(SessionID){
    MongoClient.connect(urlDB, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("notifications");
        var myquery = { sessionid: SessionID };
        dbo.collection("notifications").deleteMany(myquery, function(err, obj) {
            if (err) throw err;
            console.log(obj.result.n + " document(s) deleted");
            db.close();
        });
    });
};

function GetOpenRequests(){
    return new Promise(function(resolve, reject){
        MongoClient.connect(urlDB, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db("notifications");
            var myquery = { answer: "no" };
            dbo.collection("notifications").find(myquery, { projection: { _id: 0, sessionid: 1, requestid: 1, userid: 1 } }).toArray(function(err, result) {
                if (err) throw err;
                resolve(result);
                db.close();
            });
        });
    });
};
*/

function InsertDataAudit(data){
    return new Promise(function(resolve, reject){
        MongoClient.connect(urlDB, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db(credentials.mongoDB.colaudits);
            //var myquery = { answer: "no" };
            dbo.collection(credentials.mongoDB.colaudits).insertOne(data, function(err, res) {
                if (err) throw err;
                console.log("Document inserted");
                db.close();
            });
        });
    });
};

function DeleteDataAudit(myquery){
    MongoClient.connect(urlDB, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db(credentials.mongoDB.colaudits);
        //var myquery = { requestid: RequestID };
        dbo.collection(credentials.mongoDB.colaudits).deleteMany(myquery, function(err, obj) {
            if (err) throw err;
            console.log("Document deleted");
            db.close();
        });
    });
};


module.exports.SaveData = SaveData;
module.exports.InsertData = InsertData;
module.exports.UpdateData = UpdateData;
module.exports.DeleteData = DeleteData;
module.exports.QueryData = QueryData;
module.exports.QueryDataByID = QueryDataByID;
module.exports.InsertDataAudit = InsertDataAudit;
module.exports.DeleteDataAudit =DeleteDataAudit;
module.exports.QueryDataAudits = QueryDataAudits;
module.exports.SearchDataByID = SearchDataByID;

