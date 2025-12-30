# How to Install and Use the ABUGO Intercom Actions Extension

## Quick Installation

### Option 1: Install from .crx file (Easiest)

**📥 [Download intercom.crx](https://raw.githubusercontent.com/abugodev/chrome-extensions/main/intercom/intercom.crx)**

1. Click the download link above to download the `intercom.crx` file
2. Open Chrome and go to `chrome://extensions/`
3. Enable **"Developer mode"** (toggle in the top right corner)
4. Drag and drop the `intercom.crx` file onto the extensions page
5. Click **"Add extension"** when prompted
6. Done! The extension is now installed

### Option 2: Install from folder

1. Download and extract the `intercom` folder
2. Open Chrome and go to `chrome://extensions/`
3. Enable **"Developer mode"** (toggle in the top right corner)
4. Click **"Load unpacked"**
5. Select the `intercom` folder
6. Done! The extension is now installed

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

- **Updates**: If the extension is updated, you may need to reload it:
   - Go to `chrome://extensions/`
   - Find "ABUGO Intercom actions" extension
   - Click the refresh icon (🔄) on the extension card

- **Permissions**: Chrome will ask for permission to access `app.intercom.com` the first time you use it - click "Allow"

## Troubleshooting

**Extension not showing up?**
- Make sure Developer mode is enabled
- Try reloading the extension (refresh icon in `chrome://extensions/`)
- Refresh the Intercom page

**Button is disabled?**
- The article must be in English for the button to work
- Check the article language in the sidebar

**Need help?** Contact the development team.

