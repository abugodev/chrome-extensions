# Sharing the ABUGO Intercom Actions Extension

## Quick Share (Recommended for Small Teams)

### For You (Sharing):
1. Zip the `extension` folder
2. Share the zip file with your teammates (via email, Slack, Google Drive, etc.)

### For Your Teammates (Installing):
1. Download and extract the zip file
2. Open Chrome and go to `chrome://extensions/`
3. Enable **"Developer mode"** (toggle in top right)
4. Click **"Load unpacked"**
5. Select the extracted `extension` folder
6. Done! The extension will appear in their extensions list

## Package as .crx File (Alternative)

### For You (Creating .crx):
1. Open Chrome and go to `chrome://extensions/`
2. Enable **"Developer mode"**
3. Click **"Pack extension"**
4. Extension root directory: Select the `extension` folder
5. Private key file: Leave empty (first time) or select existing key
6. Click **"Pack Extension"**
7. Share the generated `.crx` file

### For Your Teammates (Installing .crx):
1. Download the `.crx` file
2. Open Chrome and go to `chrome://extensions/`
3. Enable **"Developer mode"**
4. Drag and drop the `.crx` file onto the extensions page
5. Click **"Add extension"** when prompted

## Important Notes

- **Updates**: If you make changes, teammates need to reload the extension:
  - Go to `chrome://extensions/`
  - Click the refresh icon on the extension card
  
- **Permissions**: The extension requires access to `app.intercom.com` - Chrome will prompt for permission on first use

- **Webhook URL**: Make sure all teammates know they may need to update the webhook URL in `content.js` if it's environment-specific

## Chrome Web Store (For Larger Teams)

For a more permanent solution, consider publishing to the Chrome Web Store:
- One-time $5 developer registration fee
- Automatic updates for all users
- Easier distribution
- More professional setup

See: https://developer.chrome.com/docs/webstore/publish

