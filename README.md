# crypto-tracker-google-sheet
Free Google Sheet to measure your crypto currencies performance. Track your transactions and measure profitability with real-time data coming from Coingecko


<p float="left">
	<img src="/screenshot.png" width="350">
	<img src="/permissions.png" width="350">
</p>
	
<p float="left">
	<img src="/transactions.png" width="250">
	<img src="/dashboard.png" width="250">
</p>


## Features

- ready to use google sheet template.
- Portfolio dashboard
- real-time market prices synchronized from Coingecko (robust communication to reduce effects of Coingecko's limitation with Google Cloud).
- Discord notifications and alerts.

## Installation
### get the template
- Go to https://docs.google.com/spreadsheets/d/12O0td_IZSjrZTCnVupI2gyR-eYX7yuB6cdSplKHF8nU
- Click **File > Create a copy** and rename it to make a copy fto your personal Drive. 
This spreadsheet already includes App Script, Sheets and triggers to make it easy to use.

### Next Steps
#### Install triggers on your google sheet
1. From File Menu, click on **"Synchronize Crypto > create Triggers"** to create an automatic synchronization with __Coingecko API__
2. on First Run, you will be ask to allow access for the script. Once granted, do step1 again.
Triggers:
- **Prices automation**: synchronize __every 5 minutes__ from Coingecko into db_coingecko
- **Discord Workflow**: send a reporting notification to your Discord webhook __everyday at 8AM__
- **Data recording**: store your global metrics __every 6 hours__ in the sheet **db_history**

#### Add your first transaction
1. From **Settings** sheet, select your currency code (e.g USD, CAD ... check [Currency Code](https://en.wikipedia.org/wiki/ISO_4217) to find your code).
Default is **CAD** but you can change the format of the cells to display properly. Format > More Formats - More Currencies"						
2. From **Settings** sheet, you can optionally edit the labels for types of operation and your technologies. You will find those options back when adding a new transaction into the sheet **"Transactions (Tx)"**						
3. From **Transactions (Tx)** sheet, remove the first example lines and add your first operation.						
4. If you track a new crypto code, write down ITS CODE in C cell, and ACCEPT the pop-up message to add the new crypto currency on the sheet **"Market (Mk)"**
5. Use **Settings** to monitor your portfolio gains
		
| Column           | Description                                                                 |   |         Required        |
|------------------|-----------------------------------------------------------------------------|---|:-----------------------:|
| Coins            | Number of coins part of the Tx you are recording (e.g. buying 3,4564 coins) |   |           yes           |
| Coin Value at Tx | Price in your traditional currency for 1 coin                               |   | only BUY / SELL / TRADE |
| Tx Value         | Transaction Value including fees (coins x unit price + fees)                |   |     yes (automatic)     |
| Fee              | fees paid for Tx                                                            |   |           yes           |					
### Optional
#### enable Discord notifications
1. From "Settings" sheet, paste your discord webhook url in J2. [where to find my webhook?](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks)
2. Test the connection by clicking on "Cryptofolio > test Discord" to send a test notification to your server.						
3. enable alert.						
4. you will receive notification each day at 8AM. Click on **"Cryptofolio > Send reporting"** to manually trigger a notification.

### Frequently Asked Questions					
#### Q: How to manage TRADE Tx record?						
R: use 2 TRADE rows to represent the transaction and get the correct balance when trading A for B: 1 row to decrement coins for A and 1 row to increment coins for B. Use a 3rd row CORRECTION to equalize Tx Value balance if needed						

#### Q: What means "same" in Low/High 24h column?						
R: "Same" is displayed when the variation High vs Low prices is jusdged too small to be meaningful (default % is < 3.5%).					

#### Q: What means the KPI DELTA RATE?						
R: This KPI measures how your portfolio performed in the last 24h compared to the top500 average trend.						

#### Q: Why does Market sheet table have several missing values?  						
R: Be sure that you have followed step2 through to connect this google sheet to Coingecko.						

#### Q: Why do Market sheet charts are displaying nothing?						
R: your data is recorded every 6 hours in the hidden sheet "db_history". come back in a few hours.						
