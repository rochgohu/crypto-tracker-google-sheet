function discordTMPL_dailyMarket(dl) {

  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var nb_crypto1h = dl.filter(i => i.change1h > 0).length;
  var nb_crypto24h = dl.filter(i => i.change24h > 0).length;
  var nb_crypto7d = dl.filter(i => i.change7d > 0).length;
  var nb_crypto30d = dl.filter(i => i.change30d > 0).length;
  var nb_crypto = dl.length;

  var rate_crypto1h = Math.round((nb_crypto1h / nb_crypto) * 5);
  var rate_crypto24h = Math.round((nb_crypto24h / nb_crypto) * 5);
  var rate_crypto7d = Math.round((nb_crypto7d / nb_crypto) * 5);
  var rate_crypto30d = Math.round((nb_crypto30d / nb_crypto) * 5);

  var payload = {
    embeds: [
      {
        title: "MARKET OVERVIEW",
        url: ss.getUrl(),
        timestamp: new Date(),
        description: "",
        fields: [
          {
            name: `# Positive Change Last 1h`,
            value: `**${nb_crypto1h}**/${nb_crypto}\n${":blue_circle:".repeat(rate_crypto1h) + ":black_circle:".repeat(5 - rate_crypto1h)}`,
            inline: true
          },
          {
            name: `# Positive Change Last 24h`,
            value: `**${nb_crypto24h}**/${nb_crypto}\n${":blue_circle:".repeat(rate_crypto24h) + ":black_circle:".repeat(5 - rate_crypto24h)}`,
            inline: true
          },
          {
            name: `# Positive Change Last 7D`,
            value: `**${nb_crypto7d}**/${nb_crypto}\n${":blue_circle:".repeat(rate_crypto7d) + ":black_circle:".repeat(5 - rate_crypto7d)}`,
            inline: true
          },
          {
            name: `# Positive Change Last 30D`,
            value: `**${nb_crypto30d}**/${nb_crypto}\n${":blue_circle:".repeat(rate_crypto30d) + ":black_circle:".repeat(5 - rate_crypto30d)}`,
            inline: true
          }
        ],
        footer: {
          text: `DAILY REPORTING | Cryptofolio G. Sheet | data from Coingecko API`
        }
      }
    ]
  };
  return payload;
}
