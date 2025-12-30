# Intercom Actions Extension

A Chrome extension that adds an "Actions" section to the Intercom Knowledge Hub sidebar, allowing you to trigger webhooks with article information.

## Features

- Adds an "Actions" section between "Data" and "Fin" sections in the sidebar
- Displays current article ID and owner email
- Button to trigger a POST webhook with article data
- Shows webhook response in an alert

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `extension` folder
5. Navigate to an Intercom Knowledge Hub article page

**Note:** Icon files (icon16.png, icon48.png, icon128.png) are optional. The extension will work without them, but you may see a warning in the Chrome extensions page.

## Configuration

Edit `content.js` and update the `WEBHOOK_URL` constant:

```javascript
const WEBHOOK_URL = 'https://your-webhook-url.com/endpoint';
```

## Usage

1. Navigate to an Intercom article page (e.g., `https://app.intercom.com/a/apps/w4slywic/knowledge-hub/all-content?activeContentId=...`)
2. The "Actions" section will appear in the sidebar between "Data" and "Fin"
3. Click "Trigger Webhook" to send a POST request with:
   - `articleId`: The article ID from the URL
   - `ownerEmail`: The owner's email (if found in the DOM)
4. The webhook response will be shown in an alert

## Webhook Payload

The extension sends a POST request with the following JSON body:

```json
{
  "articleId": "14741735",
  "ownerEmail": "user@example.com"
}
```

## Notes

- The extension automatically detects article ID from the URL parameter `activeContentId`
- Owner email is extracted from the sidebar DOM (may not always be available)
- The extension works with Intercom's single-page application navigation

