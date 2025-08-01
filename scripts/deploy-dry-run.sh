#!/usr/bin/env bash

# Βήμα 19: Dry-run deploy στο Firebase

set -e

echo "🚦 Βήμα 19: Dry-run deploy στο Firebase..."

if ! firebase deploy --dry-run; then
  echo "❌ Firebase deploy dry-run failed. Διόρθωσε τα σφάλματα!"
  exit 1
fi

echo "✅ Firebase deploy dry-run πέρασε επιτυχώς."
