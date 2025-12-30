# How to Install and Use the ABUGO Intercom Actions Extension

## Installation

**👉 [Download intercom.crx](https://raw.githubusercontent.com/abugodev/chrome-extensions/main/intercom/intercom.crx) - Click here to download**

Once downloaded:

**On Mac:** If the file seems to disappear after downloading:
- Open Chrome and press `Cmd + Shift + J` to view downloads
- Find `intercom.crx` in the list and click "Show in Finder"
- **Alternative:** Right-click the download link above → "Save Link As..." → Choose Desktop or another location

1. Open Chrome and type `chrome://extensions/` in the address bar (or copy-paste it)
2. Enable **"Developer mode"** (toggle in the top right corner)
3. Drag and drop the downloaded `intercom.crx` file onto the extensions page
4. Click **"Add extension"** when prompted
5. Done! The extension is now installed

## How to Use

1. Go to any Intercom Knowledge Hub article page
   - Example: `https://app.intercom.com/a/apps/w4slywic/knowledge-hub/all-content?activeContentId=...`

2. Look for the **"Actions"** section in the right sidebar (between "Data" and "Fin")

3. Click the **"Translate to all languages"** button

4. The extension will:
   - Send the article information to the webhook
   - Show you a response message in an alert

**Important Notes:**
- **Language requirement**: The button only works for articles in English. It will be disabled for other languages.
- **Permissions**: Chrome will ask for permission to access `app.intercom.com` the first time you use it - click "Allow"

## How to Update Extension

To update the extension, proceed the same as when installing:
1. Download the latest `intercom.crx` file from the download link above
2. Follow the installation steps (the new version will replace the old one automatically)

## Troubleshooting

**Extension not showing up?**
- Make sure Developer mode is enabled
- Go to `chrome://extensions/` and try reloading the extension (click the refresh icon 🔄)
- Refresh the Intercom page

**Can't find the downloaded .crx file on Mac?**
- Check your Downloads folder: `~/Downloads`
- Open Finder, press `Cmd + Shift + G`, type `~/Downloads`
- Check your browser's download history (Chrome: `Cmd + Shift + J`)
- Try downloading again and watch where it saves

**Button is disabled?**
- The article must be in English for the button to work
- Check the article language in the sidebar

**Need help?** Contact the development team in Slack: **#abugo_ai_automation_team**

