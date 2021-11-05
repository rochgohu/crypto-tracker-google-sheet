function postMessageToDiscord(webhook = "", pl = {}) {

  var ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  var gSheet_url = SpreadsheetApp.getActiveSpreadsheet().getUrl();
  var payloadDefault = { avatar_url: "https://lh3.googleusercontent.com/yCF7mTvXRF_EhDf7Kun5_-LMYTbD2IL-stx_D97EzpACfhpGjY_Frx8NZw63rSn2dME0v8-Im49Mh16htvPAGmEOMhiTxDZzo6rB7MY" };
  var payload = { ...payloadDefault, ...pl };
  // var ui = ui || SpreadsheetApp.getUi();

  if (!(webhook)) {
    webhook = ss.getRangeByName("discord_webhook").getValue();
    if (!(/^https?:\/\/[a-z]*/.test(webhook))) {

      Logger.log(`sending notification canceled - no valid webhook url`);
      // ui.alert(`The notification can't be send. Please provide a valid webhook url in the sheet "SETTINGS".`);
      return "ERROR_NO_VALID_WEBHOOK"
    }
  }

  if (Object.keys(payload).length === 1) {
    payload.embeds = [
      {
        title: "Bip! Bip! This is a test", description: `This notification has been triggered by :  ${gSheet_url}`
      }
    ];
  }
  console.log(payload);
  var params = {
    headers: { 'Content-Type': 'application/json' },
    method: "POST",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    var response = UrlFetchApp.fetch(webhook, params);

    Logger.log(`notification sent to ${webhook}`);
    Logger.log(response);
    if (response.message) { Logger.log(response); return "ERROR_INVALID_MESSAGE" }
    else { return "SUCCESS" }
  } catch (e) {
    var message = `there was a problem with the notification sent to ${webhook} - ${e}`;
    Logger.log(message);
    return "ERROR_UNKNOWN"
  }

}



function getTemplatePayload(dl, templateName) {
  switch (templateName) {
    case "daily_global":
      payload = discordTMPL_dailyGlobal(dl);
      break;
    case "daily_market":
      payload = discordTMPL_dailyMarket(dl);
      break;
    case "daily_portfolio":
      payload = discordTMPL_dailyPortfolio(dl);
      break;
  }
  return payload
}


function getDLCrypto(rawDL) {
  dataLayer = rawDL
    .map(function (crypto) {
      return {
        name: crypto[2],
        ticker: crypto[3],
        current_val: crypto[13],
        price: crypto[9],
        low: crypto[23],
        high: crypto[25],
        change1h: crypto[4],
        change24h: crypto[7],
        change7d: crypto[8],
        change30d: crypto[9],
        deposit: crypto[10],
        roi: crypto[17],
        roi_change: crypto[18],
        url: `https://www.coingecko.com/en/coins/${crypto[2].toLowerCase()}`
      }
    })
    .filter(crypto => crypto.name != "--not sync--")
    .map(crypto => ({ ...crypto, markdown_link: (crypto.name === "--not sync--" ? crypto.ticker : `[${crypto.ticker}](${crypto.url})`) }));

  return dataLayer;
}
