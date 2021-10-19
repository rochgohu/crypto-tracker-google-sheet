# crypto-tracker-google-sheet
Free Google Sheet to measure your crypto currencies performance. Track your transactions and measure profitability with real-time data coming from Coingecko

![screenshot](:screenshot.png)

## Features

- ready to use google sheet template.
- Portfolio dashboard
- real-time market prices synchronized from Coingecko (robust communication to reduce effects of Coingecko's limitation with Google Cloud).
- Discord notifications and alerts.

## Installation
### get the template
- Go to https://docs.google.com/spreadsheets/d/12O0td_IZSjrZTCnVupI2gyR-eYX7yuB6cdSplKHF8nU
- Click File > Create a copy and rename it to make a copy fto your personal Drive. 
This spreadsheet already includes App Script, Sheets and triggers to make it easy to use.

### Next Steps
#### Install triggers on your google sheet
1. From File Menu, click on **"Synchronize Crypto > create Triggers"** to create an automatic synchronization with __Coingecko API__
2. on First Run, you will be ask to allow access for the script. Once granted, do step1 again.
Triggers:
- **Prices automation**: synchronize __every 10 minutes__ from Coingecko into db_coingecko
- **Discord Workflow**: send a reporting notification to your Discord webhook __everyday at 8AM__
- **Data recording**: store your global metrics __every 6 hours__ in the sheet **db_history**

#### Add your first transaction
1. From **Settings** sheet, select your currency code (e.g USD, CAD ... check [Currency Code](https://en.wikipedia.org/wiki/ISO_4217) to find your code).
Default is **CAD** but you can change the format of the cells to display properly. Format > More Formats - More Currencies"						
2. From **Settings** sheet, you can optionally edit the labels for types of operation and your technologies. You will find those options back when adding a new transaction into the sheet **"Transactions (Tx)"**						
3. From **Transactions (Tx)** sheet, remove the first example lines and add your first operation.						
4. If you track a new crypto code, write down ITS CODE in C cell, and ACCEPT the pop-up message to add the new crypto currency on the sheet **"Market (Mk)"**
5. Use **Settings** to monitor your portfolio gains
					
### Optional
#### enable Discord notifications
1. From "Settings" sheet, paste your discord webhook url in J2. [where to find my webhook?](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks)
2. Test the connection by clicking on "Cryptofolio > test Discord" to send a test notification to your server.						
3. enable alert.						
4. you will receive notification each day at 8AM. Click on **"Cryptofolio > Send reporting"** to manually trigger a notification.						
