const Excel = require('exceljs');
var Docs = require('docgeneration.js');

var WeeklySalesNumbers = [
    { product: 'Product A', week1: 5, week2: 10, week3: 27 },
    { product: 'Product B', week1: 5, week2: 5, week3: 11 },
    { product: 'Product C', week1: 1, week2: 2, week3: 3 },
    { product: 'Product D', week1: 6, week2: 1, week3: 2 }
];

function GenerateMethologicalMatrix(AuditFile, NewDocFile) {

    var data = Docs.LoadAuditProgramme(AuditFile);

    const workbook = new Excel.Workbook();

    //configure workbook properties
    workbook.creator = 'AITAM';
    workbook.lastModifiedBy = 'AITAM';
    workbook.created = new Date();
    workbook.modified = new Date();
    //Set workbook dates to 1904 date system
    workbook.properties.date1904 = true;
    //Force workbook calculation on load
    workbook.calcProperties.fullCalcOnLoad = true;
    //configure workbook views
    workbook.views = [
        {
            x: 0, y: 0, width: 10000, height: 20000,
            firstSheet: 0, activeTab: 1, visibility: 'visible'
        }
    ];

    // create a sheet with red tab colour
    const worksheet = workbook.addWorksheet('Matrix');

    // Add column headers and define column keys and widths
    worksheet.columns = [
        { header: 'Audit question', key: 'aq', width: 40 },
        { header: 'Audit sub question', key: 'asq', width: 40 },
        { header: 'Audit Criteria', key: 'crit', width: 40},
        { header: 'Source of information / Audit evidence', key: 'src', width: 40},
        { header: 'Method and analysis', key: 'mtd', width: 40}
    ];

    // Add an array of rows
    var ExcelRows = [
        ['Q1','SQ1', 'AC1', 'SRC1', 'Method1'], 
        ['Q2','SQ2', 'AC2', 'SRC2', 'Method2'], 
        ['Q3','SQ3', 'AC3', 'SRC3', 'Method3'], 
        ['Q4','SQ4', 'AC4', 'SRC4', 'Method4'] 
    ];
    worksheet.addRows(ExcelRows);
    worksheet.getCell('A1').font = {
        bold: true
    };
    worksheet.getCell('B1').font = {
        bold: true
    };
    worksheet.getCell('C1').font = {
        bold: true
    };
    worksheet.getCell('D1').font = {
        bold: true
    };
    worksheet.getCell('E1').font = {
        bold: true
    };
    worksheet.getCell('F1').font = {
        bold: true
    };
    worksheet.mergeCells('A2:A5');
    worksheet.getCell('A2').alignment = { vertical: 'top', horizontal: 'left' };

    workbook.xlsx.writeFile(NewDocFile);

    console.log(NewDocFile);
};


module.exports.GenerateMethologicalMatrix = GenerateMethologicalMatrix;