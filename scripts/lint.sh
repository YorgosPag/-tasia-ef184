#!/usr/bin/env bash

# Βήμα 2 από 40: Linting του κώδικα

set -e

echo "🚦 Βήμα 2 από 40: Έλεγχος lint (npm run lint)..."

if ! npm run lint; then
  echo "❌ Linting failed. Διόρθωσε τα lint errors πριν συνεχίσεις!"
  exit 1
fi

echo "✅ Linting πέρασε επιτυχώς."
