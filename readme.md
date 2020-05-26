AITAM web version
2020-05-26
Important Change on credentials.js. New structure:

module.exports = {
    cookieSecret: '',
    gmail: {
        user: '',
        password: '',
    },
    neo4j: {
        uri:'',
        uriExternal:'',
        user: '',
        password: ''
    },
    mongoDB: {
        urlDB:'',
        user: '',
        password:'',
        dbportfolio: '',
        colportfolio: ''
    },
    AITAMmail: '',
    PlugInsPath: '',
    AuditTemplatesPath: '',
    LogFilesPath: '',
    CoreSetPath: '',
    WorkSetPath: '',
    WorkLang: 'eng',
    ReportFormat: 'odt',
    urlpaths: {
        plugins: 'public/plugins/',
        audittemplates: 'public/audittemplates/',
    }
};