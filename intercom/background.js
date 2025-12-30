// Background service worker for Intercom Actions Extension
// Handles cross-origin webhook requests to bypass CORS restrictions

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'callWebhook') {
    fetch(request.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request.payload)
    })
      .then(async (response) => {
        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType?.includes('application/json')) {
          try {
            data = await response.json();
          } catch {
            data = await response.text().catch(() => 'No response body');
          }
        } else {
          data = await response.text().catch(() => 'No response body');
        }
        
        sendResponse({
          success: true,
          status: response.status,
          statusText: response.statusText,
          data: data
        });
      })
      .catch((error) => {
        sendResponse({
          success: false,
          error: error.message
        });
      });
    
    // Return true to indicate we'll send response asynchronously
    return true;
  }
});

