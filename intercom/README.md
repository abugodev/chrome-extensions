# ABUGO Intercom Actions Extension - Developer Guide

A Chrome extension that adds an "Actions" section to the Intercom Knowledge Hub sidebar, allowing you to trigger webhooks for article translation.

## Features

- Adds an "Actions" section between "Data" and "Fin" sections in the sidebar
- Displays current article ID
- "Translate to all languages" button that triggers a POST webhook
- Language detection - button only enabled for English articles
- Shows webhook response in an alert

## Development Setup

1. Clone or download the extension files
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `intercom` folder

## Configuration

Edit `content.js` and update the `WEBHOOK_URL` constant:

```javascript
const WEBHOOK_URL = 'https://your-webhook-url.com/endpoint';
```

## Project Structure

```
intercom/
├── manifest.json      # Extension configuration
├── content.js         # Main extension logic
├── sidebar.html       # Reference HTML (for development)
├── README.md          # This file (developer documentation)
├── INSTALLATION.md    # User guide for teammates
└── intercom.crx       # Packaged extension (optional)
```

## Webhook Payload

The extension sends a POST request with the following JSON body:

```json
{
  "articleId": "14741735"
}
```

## Technical Details

- **Article ID extraction**: Automatically detected from URL parameter `activeContentId`
- **Language detection**: Reads from the sidebar DOM to determine if article is English
- **SPA navigation**: Works with Intercom's single-page application navigation
- **Icon system**: Uses Intercom's standard icon classes for consistency

## Building/Packaging

To create a `.crx` file for distribution:

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Pack extension"
4. Extension root directory: Select the `intercom` folder
5. Private key file: Leave empty (first time) or select existing `intercom.pem`
6. Click "Pack Extension"
7. The `.crx` file will be created in the parent directory

**Note:** Keep the `.pem` file secure and don't commit it to version control. It's needed to update the extension later.

## Testing

1. Load the extension in developer mode
2. Navigate to an Intercom article page
3. Verify the "Actions" section appears between "Data" and "Fin"
4. Test with English articles (button should be enabled)
5. Test with non-English articles (button should be disabled)
6. Click the button and verify webhook is called correctly

## Troubleshooting

**Extension not injecting:**
- Check browser console for errors
- Verify the URL matches the pattern in `manifest.json`
- Ensure the sidebar has loaded (wait for DOM)

**Button not working:**
- Check if article language is detected correctly
- Verify webhook URL is set correctly
- Check browser console for network errors

## Deployment

See `INSTALLATION.md` for user-facing installation instructions.

