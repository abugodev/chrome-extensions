#!/bin/bash
# Script to bump the patch version in manifest.json

cd "$(dirname "$0")"

if [ ! -f "manifest.json" ]; then
  echo "Error: manifest.json not found"
  exit 1
fi

# Get current version
current_version=$(grep -o '"version": "[^"]*"' manifest.json | cut -d'"' -f4)
echo "Current version: $current_version"

# Extract major, minor, patch
IFS='.' read -r major minor patch <<< "$current_version"

# Bump patch version
new_patch=$((patch + 1))
new_version="$major.$minor.$new_patch"

echo "New version: $new_version"

# Update manifest.json (works on macOS with sed)
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' "s/\"version\": \"$current_version\"/\"version\": \"$new_version\"/" manifest.json
else
  sed -i "s/\"version\": \"$current_version\"/\"version\": \"$new_version\"/" manifest.json
fi

echo "✅ Version bumped to $new_version in manifest.json"
echo ""
echo "Next steps:"
echo "1. Make your code changes"
echo "2. Run ./create-store-zip.sh to create the zip"
echo "3. Upload to Chrome Web Store"

