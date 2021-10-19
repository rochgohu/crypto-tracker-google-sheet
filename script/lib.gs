function sortBy(arr, key, desc=true) {     if(!(desc)){ return arr.sort((a, b) => a[key] - b[key]) }return arr.sort((a, b) => b[key] - a[key]) }

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

          if (!(dataAll.error)) {
            status = true;
            counting_success += 1;
            sheet
              .getRange(1 + (i * per_page), 1, dataAll.length, dataAll[0].length)
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

  console.log("new row:", sourceRange);
  return sourceRange;
}
