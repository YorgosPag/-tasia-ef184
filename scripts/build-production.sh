#!/usr/bin/env bash

# Βήμα 15: Δημιουργία production build

set -e

echo "🚦 Βήμα 15: Δημιουργία production build (npm run build)..."

if ! npm run build; then
  echo "❌ Production build failed. Διόρθωσε τα build errors!"
  exit 1
fi

echo "✅ Production build OK."
