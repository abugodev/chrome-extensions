# How to Install and Use the ABUGO Intercom Actions Extension

## Installation

### Option 1: Install from folder (Recommended - Works best on Mac)

**👉 [Download intercom.zip](https://raw.githubusercontent.com/abugodev/chrome-extensions/main/intercom/intercom.zip) - Click here to download**

Once downloaded:

1. Extract the `intercom.zip` file (double-click on Mac, or right-click → Extract on Windows)
2. Open Chrome and type `chrome://extensions/` in the address bar (or copy-paste it)
3. Enable **"Developer mode"** (toggle in the top right corner)
4. Click **"Load unpacked"**
5. Select the extracted `intercom` folder
6. Done! The extension is now installed

### Option 2: Install from .crx file (Alternative)

**👉 [Download intercom.crx](https://raw.githubusercontent.com/abugodev/chrome-extensions/main/intercom/intercom.crx) - Click here to download**

**Note:** On Mac, the .crx file may be automatically deleted by macOS security. If this happens, use Option 1 instead.

Once downloaded:

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
1. Download the latest `intercom.zip` file (or `intercom.crx` if using that method)
2. Follow the installation steps (the new version will replace the old one automatically)

## Troubleshooting

**Extension not showing up?**
- Make sure Developer mode is enabled
- Go to `chrome://extensions/` and try reloading the extension (click the refresh icon 🔄)
- Refresh the Intercom page

**Having issues with .crx file on Mac?**
- macOS often deletes .crx files for security reasons
- **Solution:** Use Option 1 (zip file method) instead - it's more reliable on Mac

**Button is disabled?**
- The article must be in English for the button to work
- Check the article language in the sidebar

**Need help?** Contact the development team in Slack: **#abugo_ai_automation_team**

