function cgDataRefresh() {

  var currency = SpreadsheetApp.getActiveSpreadsheet().getRangeByName("fiat_currency").getValue();
  if (!(currency)) { currency = "cad" }

  var urls = [
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&sparkline=false&price_change_percentage=1h%2C24h%2C7d%2C30d`,
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&sparkline=false&price_change_percentage=1h%2C24h%2C7d%2C30d`
  ];

  var count = safeGuardImportJSON(urls, "db_coingecko");
  return count;

}

function cgDataManualRefresh() {
  var count = cgDataRefresh();
  var ui = SpreadsheetApp.getUi();

  switch (count) {
    case 0:
      uiMessage = "Nothing was received from Coingecko. This can happen, try again in a few seconds";
      break;
    case 1:
      uiMessage = "New crypto prices were partially refreshed. Try again in a few seconds";
      break;
    default:
      uiMessage = "Success! Your Top500 crypto data has been refreshed";
  }

  ui.alert("Price Refresh Status", uiMessage, ui.ButtonSet.OK);
}

function testDiscord() {
  var ui = SpreadsheetApp.getUi();
  var ping = postMessageToDiscord();

  switch (ping) {
    case "SUCCESS":
      uiMessage = "Test successful! The Google Sheet was correctly linked to your discord.";
      break;
    case "ERROR_NO_VALID_WEBHOOK":
      uiMessage = `Test Failed. Please provide a valid webhook url in the sheet "SETTINGS".`;
      break;
    default:
      uiMessage = `Test Failed. there was a problem with the notification sent.`;
  }
  ui.alert("Discord Status", uiMessage, ui.ButtonSet.OK);
}

function storeRows2SheetTrigger() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var globalMetrics = prepareDataRange("total", [0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11]);

  storeRows2Sheet(globalMetrics, "db_history");
}


function dailyAlertTrigger() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var globalMetrics = prepareDataRange("total", [0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11]);

  var discord = ss.getRangeByName("discord_webhook").getValue();

  if (discord) {

    var discord_daily_alert = ss.getRangeByName("discord_daily").getValue();

    if (discord_daily_alert) {
      var payload = getTemplatePayload(globalMetrics, "daily");
      postMessageToDiscord(undefined, payload);
    }
    alertingTopDetails();

  }
}

function beautify(number, plusSignFront = true, percent = false, dec = 2) {
  if (percent) { number = parseFloat(number) * 100; }
  if (plusSignFront) {
    return (number > 0 ? "+" : "") + parseFloat(parseFloat(number).toFixed(dec)).toLocaleString('fr')
  }
  return parseFloat(parseFloat(number).toFixed(dec)).toLocaleString('fr')
}

function alertingTopDetails() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var cryptoData = prepareDataRange("portfolio_detail");

  cryptoData = cryptoData.map(function (crypto) {
    return {
      name: crypto[3],
      ticker: crypto[4],
      current_val: crypto[15],
      price: crypto[11],
      low: crypto[24],
      high: crypto[26],
      change1h: crypto[6],
      change24h: crypto[8],
      change7d: crypto[9],
      change30d: crypto[10],
      deposit: crypto[12],
      roi: crypto[18],
      roi_change: crypto[19],
      url: `https://www.coingecko.com/en/coins/${crypto[1]}`
    }

  });

  var top5_assets = sortBy(cryptoData, "current_val").slice(0, 5);
  var top5_gains = sortBy(cryptoData, "roi_change").slice(0, 5);
  var top5_loss = sortBy(cryptoData, "roi_change", false).slice(0, 5);
  var top5_24hchange = sortBy(cryptoData, "change24h").slice(0, 5);
  var last5_24hchange = sortBy(cryptoData, "change24h", false).slice(0, 5);

  var nb_crypto1h = cryptoData.filter(i => i.change1h > 0).length;
  var nb_crypto24h = cryptoData.filter(i => i.change24h > 0).length;
  var nb_crypto7d = cryptoData.filter(i => i.change7d > 0).length;
  var nb_crypto30d = cryptoData.filter(i => i.change30d > 0).length;
  var nb_crypto = cryptoData.length;

  var rate_crypto1h = Math.round((nb_crypto1h / nb_crypto) * 5);
  var rate_crypto24h = Math.round((nb_crypto24h / nb_crypto) * 5);
  var rate_crypto7d = Math.round((nb_crypto7d / nb_crypto) * 5);
  var rate_crypto30d = Math.round((nb_crypto30d / nb_crypto) * 5);


  console.log(cryptoData);

  var payload2 = {
    embeds: [
      {
        title: "MARKET OVERVIEW",
        url: ss.getUrl(),
        timestamp: new Date(),
        description: "",
        fields: [
          {
            name: `# Crypto 1h`,
            value: `${nb_crypto1h}\n${":blue_circle:".repeat(rate_crypto1h) + ":black_circle:".repeat(5 - rate_crypto1h)}`,
            inline: true
          },
          {
            name: `# Crypto 24h`,
            value: `${nb_crypto24h}\n${":blue_circle:".repeat(rate_crypto24h) + ":black_circle:".repeat(5 - rate_crypto24h)}`,
            inline: true
          },
          {
            name: `# Crypto 7D`,
            value: `${nb_crypto7d}\n${":blue_circle:".repeat(rate_crypto7d) + ":black_circle:".repeat(5 - rate_crypto7d)}`,
            inline: true
          },
          {
            name: `# Crypto 30D`,
            value: `${nb_crypto30d}\n${":blue_circle:".repeat(rate_crypto30d) + ":black_circle:".repeat(5 - rate_crypto30d)}`,
            inline: true
          }
        ],
        footer: {
          text: `DAILY REPORTING | Cryptofolio G. Sheet | data from Coingecko API`
        }
      }
    ]
  };
  postMessageToDiscord(undefined, payload2);

  var payload = {
    embeds: [
      {
        title: "PORTFOLIO OVERVIEW",
        url: ss.getUrl(),
        timestamp: new Date(),
        description: "",
        fields: [
          {
            name: `:trophy: Top5 Biggest Assets :trophy:`,
            value: top5_assets.map((el, i) => `- ${":black_circle:".repeat(i)}${":star:".repeat(5 - i)} [${el.ticker}](${el.url}) **${beautify(el.current_val, false)}$** (${beautify(el.roi)}$)`).join('\n'),
            inline: false
          },
          {
            name: `:trophy: Top5 GAINS :trophy:`,
            value: top5_gains.map((el, i) => `- ${":black_circle:".repeat(Math.round(i / 2))}${":star:".repeat(Math.round((5 - i) / 2))} [${el.ticker}](https://test.fr) **${beautify(el.roi)}$** (${beautify(el.roi_change, true, true, 0)}%)`).join('\n'),
            inline: true
          },
          {
            name: `:skull: Top5 LOSSES :skull:`,
            value: top5_loss.map((el, i) => `- ${":black_circle:".repeat(Math.round(i / 2))}${":ghost:".repeat(Math.round((5 - i) / 2))} [${el.ticker}](https://test.fr) **${beautify(el.roi)}$** (${beautify(el.roi_change, true, true, 0)}%)`).join('\n'),
            inline: true
          },
          {
            name: `:trophy: Top5 CHANGE 24H :trophy:`,
            value: top5_24hchange.map((el, i) => `- ${":black_circle:".repeat(i)}${":star:".repeat(5 - i)} [${el.ticker}](https://test.fr) **${beautify(el.change24h, true, true)}%** (low = ${beautify(el.low, false)}$ > **${beautify(el.price, false)}$** > max = ${beautify(el.high, false)}$)`).join('\n'),
            inline: false
          },
          {
            name: `:skull: Last5 CHANGE 24H :skull:`,
            value: last5_24hchange.map((el, i) => `- ${":black_circle:".repeat(i)}${":ghost:".repeat(5 - i)} [${el.ticker}](https://test.fr) **${beautify(el.change24h, true, true)}%** (low = ${beautify(el.low, false)}$ > **${beautify(el.price, false)}$** > max = ${beautify(el.high, false)}$)`).join('\n'),
            inline: false
          }
        ],
        footer: {
          text: `DAILY REPORTING | Cryptofolio G. Sheet | data from Coingecko API`
        }
      }
    ]
  };
  postMessageToDiscord(undefined, payload);
}
