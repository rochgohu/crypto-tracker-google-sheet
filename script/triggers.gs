function onOpen() {
  SpreadsheetApp.getUi().createMenu("Cryptofolio")
    .addItem("Create Triggers", "createTriggers")
    .addItem("Refresh crypto prices", "cgDataManualRefresh")
    .addItem("Discord - Test connection", "testDiscord")
    .addItem("Discord - send reporting", "dailyAlertTrigger")
    .addToUi();
}


function createTriggers() {
  var allTriggers = ScriptApp.getProjectTriggers();
  if (allTriggers.length < 1) { initTriggers(); SpreadsheetApp.getUi().alert('Your triggers has been created. Syncronization of crypto prices enabled. Prices will be updated in a few minutes'); }
  else { SpreadsheetApp.getUi().alert('Nothing done, your Spreadshet is already setup'); }
}

function initTriggers() {
  // Trigger every 2 hours.
  ScriptApp.newTrigger('cgDataRefresh')
    .timeBased()
    .everyMinutes(10)
    .create();

  ScriptApp.newTrigger('storeRows2SheetTrigger')
    .timeBased()
    .everyHours(6)
    .create();

  ScriptApp.newTrigger('dailyAlertTrigger')
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .create();
}

function onEdit(e) {

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();

  var sh = ss.getSheetByName("Market (Mk)");

  var myRange = ss.getRange('crypto_opes');
  var existingValues = ss.getRange('crypto_market');
  var uiFormat = ss.getRange('fiat_currency');

  var activeSheet = e.source.getActiveSheet();
  var row = e.range.getRow();
  var col = e.range.getColumn();


  if (activeSheet.getName() == "Settings") {
    if (col >= uiFormat.getColumn() && col <= uiFormat.getLastColumn() && row >= uiFormat.getRow() && row <= uiFormat.getLastRow()) {
      updateCurrencyFormat();
    }
  }
  else if (activeSheet.getName() == "Transactions (Tx)") {

    if (col >= myRange.getColumn() && col <= myRange.getLastColumn() && row >= myRange.getRow() && row <= myRange.getLastRow()) {
      var cellValue = SpreadsheetApp.getActiveSheet().getRange(row, col).getValue().toUpperCase();
      var cryptoRange = existingValues.getValues();

      if (cryptoRange.flat().includes(cellValue) === false) {
        var choiceBtn = ui.alert(`New Crypto Detected: ${cellValue}`, "do you want to add it?", ui.ButtonSet.OK_CANCEL);
        if (choiceBtn == ui.Button.OK) {

          let f = sh.getFilter();
          if (f != null && typeof f == 'object') {
            toFilter = f.getRange();
            f.remove();
          }

          var lRow = sh.getLastRow(), lCol = sh.getLastColumn();

          var range = ss.getRange('template_row_crypto');

          sh.insertRowsAfter(lRow, 1);
          range.copyTo(sh.getRange(lRow + 1, 1, 1, lCol), { contentsOnly: false });
          sh.getRange(lRow + 1, 3, 1, 1).setValue(cellValue);

          ss.setNamedRange("portfolio_detail", sh.getRange("A13:AA"));
          ss.getRange('portfolio_detail').createFilter().sort(3, true);
        }
      }

    }
  }
}

