#!/bin/bash
# Script to create a Chrome Web Store-ready zip file

cd "$(dirname "$0")"

echo "Creating Chrome Web Store zip file..."

# Create zip excluding unnecessary files
# IMPORTANT: Never include .pem files (private keys)!
zip -r intercom-store.zip . \
  -x "*.pem" \
  -x "intercom.pem" \
  -x "*.crx" \
  -x "*.zip" \
  -x "*.git*" \
  -x "README.md" \
  -x "INSTALLATION.md" \
  -x "PUBLISHING.md" \
  -x "PRE_PUBLISH_CHECKLIST.md" \
  -x "SHARING.md" \
  -x "create-store-zip.sh" \
  -x "sidebar.html" \
  -x "icon.png" \
  -x ".DS_Store" \
  -x "*/.DS_Store"

echo "✅ Created intercom-store.zip"
echo ""
echo "This zip file is ready to upload to Chrome Web Store!"
echo "See PUBLISHING.md for next steps."

