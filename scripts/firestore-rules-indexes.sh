#!/usr/bin/env bash

# Βήμα 8: Έλεγχος Firestore security rules και indexes

set -e

echo "🚦 Βήμα 8: Έλεγχος Firestore security rules..."

if [ -f firestore.rules ]; then
  if ! firebase emulators:exec --only firestore 'echo "Firestore emulator is running"'; then
    echo "❌ Firestore rules validation failed!"
    exit 1
  fi
  echo "✅ Firestore security rules are valid."
else
  echo "ℹ️  No firestore.rules file found, skipping validation."
fi

echo "🚦 Έλεγχος Firestore indexes..."

if [ -f firestore.indexes.json ]; then
  echo "ℹ️  Found firestore.indexes.json - make sure indexes are deployed in production."
  echo "✅ Firestore indexes file found."
else
  echo "ℹ️  No firestore.indexes.json found."
fi
