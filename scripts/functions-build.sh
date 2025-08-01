#!/usr/bin/env bash

# Βήμα 9: Έλεγχος και build Firebase Functions

set -e

echo "🚦 Βήμα 9: Έλεγχος και build Firebase Functions..."

if [ -d "functions" ]; then
  cd functions
  if ! npm run build 2>/dev/null; then
    echo "❌ Functions build failed!"
    cd ..
    exit 1
  fi
  cd ..
  echo "✅ Firebase Functions build OK."
else
  echo "ℹ️  No functions directory found, skipping."
fi
