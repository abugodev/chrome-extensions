# Pre-Publish Checklist

Use this checklist before submitting to Chrome Web Store.

## ✅ Files Ready

- [x] `manifest.json` - Has version, name, description, icons
- [x] `content.js` - Main extension code
- [x] `icon16.png` - 16x16 icon
- [x] `icon48.png` - 48x48 icon  
- [x] `icon128.png` - 128x128 icon
- [x] `intercom-store.zip` - Clean zip file (only necessary files)

## ✅ Manifest.json Check

- [x] `manifest_version: 3` ✓
- [x] `name: "ABUGO Intercom actions"` ✓
- [x] `version: "1.0.0"` ✓
- [x] `description` present ✓
- [x] `icons` section with all 3 sizes ✓
- [x] `permissions` defined ✓
- [x] `host_permissions` for Intercom ✓
- [x] `content_scripts` configured ✓

## ✅ Code Check

- [x] Webhook URL is set in `content.js` ✓
- [x] No hardcoded sensitive data ✓
- [x] No console.log statements (optional cleanup) ✓

## ✅ Store Package

- [x] Zip file created with `./create-store-zip.sh` ✓
- [x] Zip contains only: manifest.json, content.js, icon16.png, icon48.png, icon128.png ✓
- [x] No .pem, .crx, .zip, docs, or dev files included ✓
- [x] File size reasonable (< 5MB) ✓

## 📋 Before Uploading

1. **Test locally first:**
   - Load unpacked extension in Chrome
   - Test on Intercom article page
   - Verify "Actions" section appears
   - Test button functionality

2. **Prepare store listing:**
   - Name: "ABUGO Intercom Actions"
   - Summary: Ready (see PUBLISHING.md)
   - Description: Ready (see PUBLISHING.md)
   - Screenshots: Take 1-2 screenshots
   - Category: Productivity or Developer Tools
   - Privacy: Declare data handling

3. **Account setup:**
   - [ ] Chrome Web Store developer account registered ($5 paid)
   - [ ] Trader/Non-trader status declared
   - [ ] Payment method verified

## 🚀 Ready to Publish!

Once all checks pass:
1. Run `./create-store-zip.sh` to create final zip
2. Upload `intercom-store.zip` to Chrome Web Store
3. Fill out store listing
4. Set visibility to "Unlisted"
5. Submit for review

## 📝 Notes

- Current webhook URL: `https://abugo.app.n8n.cloud/webhook/queue-article`
- Version: 1.0.0
- Target: Internal team use (unlisted)
- Estimated review time: 1-3 business days

