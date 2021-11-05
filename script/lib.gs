/**
 * @OnlyCurrentDoc
 */

function sortBy(arr, key, desc = true) { if (!(desc)) { return arr.sort((a, b) => a[key] - b[key]) } return arr.sort((a, b) => b[key] - a[key]) }

function updateCurrencyFormat() {

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var shMarket = ss.getSheetByName("Market (Mk)");
  var shHistory = ss.getSheetByName("db_history");
  var shRowTemplate = ss.getSheetByName("--do not remove--");
  var uiCurrency = ss.getRange("fiat_currency").getValue();

  var currencyFormat = {
    "USD": "[$$]#,##0.00",
    "CAD": "[$$]#,##0.00",
    "GBP": "[$£]#,##0.00",
    "EUR": "[$€]#,##0.00"
  };
  var defaultFormat = "#,##0.00";

  var selFormat = currencyFormat[uiCurrency] || defaultFormat;

  // update Market Sheet: Total Header
  ss.getRangeByName("portfolio_growth").setNumberFormat(selFormat);

  // update Market Sheet: Crypto Table
  numRows = ss.getRangeByName("portfolio_detail").getNumRows();
  a1Range_settings = [5, 9, 10, 12, 13, 16, 18, 22, 24]
    .map(nCol => ss.getRangeByName("portfolio_detail").offset(0, nCol, numRows, 1).getA1Notation());
  shMarket.getRangeList(a1Range_settings).setNumberFormat(selFormat);

  // update Row Template Sheet
  numRows = ss.getRangeByName("template_row_crypto").getNumRows();
  a1Range_settings = [5, 9, 10, 12, 13, 16, 18, 22, 24]
    .map(nCol => ss.getRangeByName("template_row_crypto").offset(0, nCol, numRows, 1).getA1Notation());
  shRowTemplate.getRangeList(a1Range_settings).setNumberFormat(selFormat);

  // update db_history Sheet
  numRows = ss.getRangeByName("db_history").getNumRows();
  a1Range_settings = [2, 3, 5, 6]
    .map(nCol => ss.getRangeByName("db_history").offset(0, nCol, numRows, 1).getA1Notation());
  shHistory.getRangeList(a1Range_settings).setNumberFormat(selFormat);
}

function beautify(number, plusSignFront = true, percent = false, dec = 2) {
  if (percent) { number = parseFloat(number) * 100; }
  if (plusSignFront) {
    return (number > 0 ? "+" : "") + parseFloat(parseFloat(number).toFixed(dec)).toLocaleString('fr')
  }
  return parseFloat(parseFloat(number).toFixed(dec)).toLocaleString('fr')
}

function safeGuardImportJSON(urls = [], sheet = "", per_page = 250) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheet);

  var counting_success = 0;

  urls
    .map((url, i) => `${url}&per_page=${per_page}&page=${i + 1}`)
    .forEach(function (url, i) {

      var status = false;
      var counting = 0;

      while (!(status) && counting < 3) {
        try {
          var dataAll = ImportJSON(url, undefined, (i > 0 ? "noHeaders" : "noTruncate"));
          console.log(i, counting);
          console.log(url);

          if (!(dataAll.error)) {
            console.log(dataAll);
            status = true;
            counting_success += 1;
            sheet
              .getRange(1 + (i * per_page) + (i > 0 ? 1 : 0), 1, dataAll.length, dataAll[0].length)
              .setValues(dataAll);
          }
          break;

        } catch (e) { console.log(e) }

        counting++;
        Utilities.sleep(1500);
      }
    });
  return counting_success
}

function getLocalNow(tz = SpreadsheetApp.getActive().getSpreadsheetTimeZone(), format = "dd/MM/yyyy") {
  return Utilities.formatDate(new Date(), tz, format);
}

function prepareDataRange(sourceRangeName, selectCols = []) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var sourceRange = ss.getRangeByName(sourceRangeName).getValues();

  sourceRange = filterRowsRange(sourceRange);

  sourceRange = resizeColsRange(sourceRange, selectCols);

  // add date to the new log
  sourceRange.forEach(i => {
    i.unshift(getLocalNow());
    i.push(getLocalNow(undefined, "yyyy-MM-dd HH:mm:ssZ"));
  });

  return sourceRange;

  function filterRowsRange(range, keep_headers = false) {
    var _r = range.filter(row => row.join("").length !== 0);

    if (keep_headers) { return _r }
    else { return _r.slice(1) }
  }

  function resizeColsRange(range, selectCols = []) {
    if (selectCols.length == 0) { return range }
    else { selectCols = selectCols.filter(el => el <= range[0].length) }

    let filteredRange = range.map((row) => selectCols.map(function (el) { return row[el] }));
    return filteredRange;
  }
}

function storeRows2Sheet(sourceRange, targetSheet) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var targetSheet = ss.getSheetByName(targetSheet);

  sourceRange.forEach(row => targetSheet.appendRow(row));

  return sourceRange;
}
