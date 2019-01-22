AITAM web version
2019-01-21
Important Change on credentials.js. New structure:

module.exports = {
    cookieSecret: '',
    gmail: {
        user: '',
        password: '',
    },
    neo4j: {
        uri:'',
        user: '',
        password: ''
    },
     AITAMmail: '',
    PlugInsPath: '',
    LogFilesPath: '',
    CoreSetPath: '',
    WorkSetPath: '',
    WorkLang: 'eng',
    urlpaths: {
        plugins: '',
    }
};