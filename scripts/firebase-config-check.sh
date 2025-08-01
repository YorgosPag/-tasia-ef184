#!/usr/bin/env bash

# Βήμα 6: Έλεγχος Firebase configuration

set -e

echo "🚦 Βήμα 6: Έλεγχος Firebase configuration..."

if [ ! -f firebase.json ]; then
  echo "❌ Missing firebase.json file!"
  exit 1
fi

if [ ! -f .firebaserc ]; then
  echo "❌ Missing .firebaserc file!"
  exit 1
fi

if ! command -v firebase >/dev/null 2>&1; then
  echo "❌ Firebase CLI is not installed!"
  exit 1
fi

FIREBASE_VERSION=$(firebase --version)
echo "✅ Firebase CLI version: $FIREBASE_VERSION"
echo "✅ Firebase configuration files found."
