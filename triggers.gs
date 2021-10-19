function onEdit(e) {
  var myRange = SpreadsheetApp.getActiveSpreadsheet().getRange('crypto_opes');
  var existingValues = SpreadsheetApp.getActiveSpreadsheet().getRange('crypto_market');
  // SpreadsheetApp.getUi().alert("myRange in A1 Notation is: " + myRange.getA1Notation()); //If you're having problems, uncomment this to make sure your named range is properly defined

  //Let's get the row & column indexes of the active cell
  var activeSheet = e.source.getActiveSheet();
  var row = e.range.getRow();
  var col = e.range.getColumn();

  if (activeSheet.getName() == "Transactions (Tx)") {

    //Check that your active cell is within your named range
    if (col >= myRange.getColumn() && col <= myRange.getLastColumn() && row >= myRange.getRow() && row <= myRange.getLastRow()) { //As defined by your Named Range
      var cellValue = SpreadsheetApp.getActiveSheet().getRange(row, col).getValue().toUpperCase();
      var cryptoRange = existingValues.getValues();

      if (cryptoRange.flat().includes(cellValue) === false) {
        var ui = SpreadsheetApp.getUi();
        var choiceBtn = ui.alert(`New Crypto Detected: ${cellValue}`, "do you want to add it?", ui.ButtonSet.OK_CANCEL);

        if (choiceBtn == ui.Button.OK) {
          var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Market (Mk)"), lRow = sh.getLastRow();
          var lCol = sh.getLastColumn(), range = sh.getRange(lRow, 1, 1, lCol);

          // copy last row to a new line and clean it with new crypto values
          sh.insertRowsAfter(lRow, 1);
          range.copyTo(sh.getRange(lRow + 1, 1, 1, lCol), { contentsOnly: false });
          sh.getRange(lRow + 1, 2, 1, 2).setValues([["", cellValue]]);

          // sort by crypto
          sh.getRange('portfolio_detail').sort(3);

        }
      }

    } else {
      // SpreadsheetApp.getUi().alert('You Edited a Cell OUTSIDE the Range!');//Comment this out or insert code if you want to do something if the edited cells AREN'T inside your named range
      return;
    }

  }

}

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
