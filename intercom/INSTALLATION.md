# How to Install and Use the ABUGO Intercom Actions Extension

## Installation

**👉 [Download intercom.crx](https://raw.githubusercontent.com/abugodev/chrome-extensions/main/intercom/intercom.crx) - Click here to download**

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

## Important Notes

- **Language requirement**: The button only works for articles in English. It will be disabled for other languages.

- **Updates**: Since this extension is installed from a local `.crx` file, it won't update automatically. To get updates:
   - Download the latest `intercom.crx` file from the link above
   - Go to `chrome://extensions/` in Chrome
   - Find "ABUGO Intercom actions" extension
   - Click the **Remove** button to uninstall the old version
   - Drag and drop the new `intercom.crx` file to install the updated version

- **Permissions**: Chrome will ask for permission to access `app.intercom.com` the first time you use it - click "Allow"

## Troubleshooting

**Extension not showing up?**
- Make sure Developer mode is enabled
- Go to `chrome://extensions/` and try reloading the extension (click the refresh icon 🔄)
- Refresh the Intercom page

**Button is disabled?**
- The article must be in English for the button to work
- Check the article language in the sidebar

**Need help?** Contact the development team.

